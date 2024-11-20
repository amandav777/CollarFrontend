import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: step <= currentStep ? "#D94509" : "#ccc",
              },
            ]}
          />
          {step < totalSteps && <View style={styles.connector} />}
        </View>
      ))}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    top:50,
    left:"5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  stepContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  stepCircle: {
    width: screenWidth - 210,
    height: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  connector: {
    width: 5,
    height: 2,
    backgroundColor: "white",
  },
});

export default StepIndicator;
