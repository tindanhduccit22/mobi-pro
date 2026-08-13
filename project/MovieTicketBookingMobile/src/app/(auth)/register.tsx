import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { register } from "../../api/authApi";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await register(
        fullName,
        email,
        password,
        phone,
        gender
      );

      Alert.alert("Success", data.message, [
        {
          text: "Login",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Register failed",
        error.response?.data?.message || "Cannot connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Create your Movie Ticket account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.genderContainer}>
          <Pressable
            style={[
              styles.genderButton,
              gender === "Male" && styles.genderSelected,
            ]}
            onPress={() => setGender("Male")}
          >
            <Text>Male</Text>
          </Pressable>

          <Pressable
            style={[
              styles.genderButton,
              gender === "Female" && styles.genderSelected,
            ]}
            onPress={() => setGender("Female")}
          >
            <Text>Female</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating account..." : "Register"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
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
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#ddd",
  },
  button: {
    backgroundColor: "#e50914",
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});