import { useState, useEffect } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../api/profileApi";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await getProfile(user.userID);
      setFullName(data.fullName || user.fullName);
      setPhone(data.phone || "");
      setGender(data.gender || "Male");
    } catch (error) {
      console.log("Error loading profile", error);
      // Fallback to user context data
      setFullName(user.fullName);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updateProfile(user.userID, { fullName, phone, gender });
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter full name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          <Pressable
            style={[styles.genderButton, gender === "Male" && styles.genderButtonActive]}
            onPress={() => setGender("Male")}
          >
            <Text style={[styles.genderText, gender === "Male" && styles.genderTextActive]}>Male</Text>
          </Pressable>
          <Pressable
            style={[styles.genderButton, gender === "Female" && styles.genderButtonActive]}
            onPress={() => setGender("Female")}
          >
            <Text style={[styles.genderText, gender === "Female" && styles.genderTextActive]}>Female</Text>
          </Pressable>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },
  genderButtonActive: {
    borderColor: "#E50914",
    backgroundColor: "#fff9f9",
  },
  genderText: {
    fontSize: 16,
    color: "#666",
  },
  genderTextActive: {
    color: "#E50914",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#E50914",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
