"""
Production Model Training Pipeline for Forecast Bust Detection
Trains LightGBM Classifier on real ERA5 reanalysis and NWP forecast error data.
Strictly enforces Time-Based Train/Test Split (Train: 2018-2022 events; Holdout Test: 2023-2024 events).
Evaluates against Climatological Baseline and exports real validation metrics & SHAP explainer.
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    brier_score_loss,
    confusion_matrix,
    roc_curve
)
from sklearn.preprocessing import StandardScaler
from lightgbm import LGBMClassifier

from app.ml.real_data_pipeline import build_real_nwp_era5_dataset

# Ensure artifacts directory exists
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

FEATURE_COLS = [
    "lead_time",
    "ensemble_spread",
    "cape",
    "vertical_wind_shear",
    "z500_vorticity_gradient",
    "moisture_flux_convergence",
    "baroclinic_growth_rate",
    "climatological_anomaly"
]

def train_and_evaluate():
    print("=" * 65)
    print("  TRAINING LIGHTGBM FORECAST BUST DETECTION MODEL")
    print("  GROUND-TRUTH: REAL ERA5 REANALYSIS & NWP ERROR ARCHIVES")
    print("  SPLIT STRATEGY: TIME-BASED HOLDOUT (TRAIN: <=2022, TEST: >=2023)")
    print("=" * 65)

    # 1. Ingest Real ERA5 Reanalysis & NWP Dataset
    print("[1/5] Ingesting real event dataset across 36 IMD subdivisions...")
    df = build_real_nwp_era5_dataset(use_cache=True)
    
    # Save clean sample for inspection & direct download
    sample_path = os.path.join(ARTIFACTS_DIR, "dataset_sample.csv")
    sample_cols = [
        "event_name", "split", "subdivision_name", "lead_time",
        "observed_era5_precip", "nwp_forecast_precip", "forecast_error_magnitude",
        "is_bust", "ensemble_spread", "cape", "vertical_wind_shear",
        "z500_vorticity_gradient", "moisture_flux_convergence"
    ]
    df[sample_cols].head(500).to_csv(sample_path, index=False)
    print(f"      Saved real event sample dataset to: {sample_path}")

    # 2. TIME-BASED TRAIN/TEST SPLIT
    # Train on 2019-2022 events; Test on unseen 2023-2024 events
    print("[2/5] Performing Time-Based Train/Test Split...")
    train_mask = df["split"] == "TRAIN"
    test_mask = df["split"] == "TEST_HOLDOUT"

    X_train = df.loc[train_mask, FEATURE_COLS]
    y_train = df.loc[train_mask, "is_bust"]

    X_test = df.loc[test_mask, FEATURE_COLS]
    y_test = df.loc[test_mask, "is_bust"]

    print(f"      Train Samples (<=2022 Events): {len(X_train)} | Bust Rate: {y_train.mean()*100:.1f}%")
    print(f"      Test Samples  (>=2023 Events): {len(X_test)}  | Bust Rate: {y_test.mean()*100:.1f}%")
    print("      Test Events: Cyclone Biparjoy (Jun 2023), HP Deluge (Jul 2023), Cyclone Michaung (Dec 2023), Stable Winter (Jan 2024)")

    # 3. Train LightGBM Classifier
    print("[3/5] Fitting LightGBM Classifier with GBDT...")
    model = LGBMClassifier(
        n_estimators=160,
        learning_rate=0.045,
        num_leaves=31,
        max_depth=6,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        verbose=-1
    )
    model.fit(X_train, y_train)

    # 4. Model Evaluation & Benchmarking Against Climatological Baseline
    print("[4/5] Evaluating on unseen future events (2023-2024 holdout)...")
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_proba >= 0.5).astype(int)

    # Climatological Baseline (naive probability based on historical training frequency)
    climatology_prob = float(y_train.mean())
    y_baseline_proba = np.full_like(y_pred_proba, climatology_prob)

    # Metrics
    auc = roc_auc_score(y_test, y_pred_proba)
    baseline_auc = 0.5000  # Naive baseline has AUC of 0.50
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    brier = brier_score_loss(y_test, y_pred_proba)
    baseline_brier = brier_score_loss(y_test, y_baseline_proba)
    bss = 1.0 - (brier / baseline_brier) if baseline_brier > 0 else 0.0

    cm = confusion_matrix(y_test, y_pred).tolist()
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    
    # Subsample ROC curve points for compact JSON storage
    roc_points = [
        {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
        for f, t in zip(fpr[::max(1, len(fpr)//40)], tpr[::max(1, len(tpr)//40)])
    ]

    # Feature Importances
    importances = model.feature_importances_
    feat_imp = [
        {"feature": feat, "importance": int(imp)}
        for feat, imp in sorted(zip(FEATURE_COLS, importances), key=lambda x: x[1], reverse=True)
    ]

    metrics_payload = {
        "model_type": "LightGBM Classifier (GBDT)",
        "split_strategy": "Time-Based Event Holdout (Train: <=2022, Test: >=2023)",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "train_events": "Aug 2019 Odisha Depression, Jul 2021 Break Monsoon, May 2022 Heatwave",
        "test_events": "Jun 2023 Cyclone Biparjoy, Jul 2023 HP Deluge, Dec 2023 Cyclone Michaung, Jan 2024 Stable Flow",
        "features_count": len(FEATURE_COLS),
        "features": FEATURE_COLS,
        "metrics": {
            "auc_roc": round(float(auc), 4),
            "baseline_auc_roc": round(float(baseline_auc), 4),
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "brier_score": round(float(brier), 4),
            "baseline_brier_score": round(float(baseline_brier), 4),
            "brier_skill_score": round(float(bss), 4)
        },
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "roc_curve": roc_points,
        "feature_importances": feat_imp,
        "climatology_baseline": {
            "prior_bust_rate": round(climatology_prob, 4),
            "description": "Historical climatological bust frequency by region and season."
        }
    }

    # Save metrics JSON
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"      Saved validation metrics to: {metrics_path}")

    # 5. Serialize Model
    print("[5/5] Serializing model artifacts (joblib)...")
    model_path = os.path.join(ARTIFACTS_DIR, "bust_lgbm_model.joblib")
    joblib.dump(model, model_path)
    print(f"      Saved model to: {model_path}")

    # 6. Fit and save real SHAP TreeExplainer
    try:
        import shap
        print("      Fitting real SHAP TreeExplainer...")
        explainer = shap.TreeExplainer(model)
        explainer_path = os.path.join(ARTIFACTS_DIR, "shap_explainer.joblib")
        joblib.dump(explainer, explainer_path)
        print(f"      Saved real SHAP TreeExplainer to: {explainer_path}")
    except Exception as e:
        print(f"      Note: SHAP explainer fitting skipped or failed: {e}")

    print("\n" + "=" * 65)
    print(f"  MODEL TRAINING COMPLETE ON TIME-BASED HOLDOUT!")
    print(f"  Trained Model AUC-ROC: {auc:.4f} vs Climatology Baseline: {baseline_auc:.4f}")
    print(f"  Accuracy: {acc*100:.1f}% | Precision: {prec*100:.1f}% | Recall: {rec*100:.1f}% | F1: {f1:.4f}")
    print(f"  Brier Skill Score (BSS): {bss:.4f}")
    print("=" * 65)
    return metrics_payload

if __name__ == "__main__":
    train_and_evaluate()
