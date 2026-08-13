import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      await auth.login(data);
      Alert.alert("Success", data.message);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error.response?.data?.message || "Cannot connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Movie Ticket</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Login"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>
            Don't have an account? Register
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
          <Text style={styles.link}>
            Forgot Password?
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 24,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#e50914",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});