import { useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleSendLink = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    Alert.alert("Success", "Reset link sent to your email");
    router.push("/(auth)/reset-password");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Pressable style={styles.button} onPress={handleSendLink}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>Back to Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    padding: 24,
    gap: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#e50914",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    color: "#e50914",
    fontWeight: "bold",
  },
});
