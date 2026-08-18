import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, Switch } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "English" ? "Vietnamese" : "English");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#ffcccc" }}
              thumbColor={darkMode ? "#E50914" : "#f4f3f4"}
            />
          </View>

          <Pressable style={styles.settingItem} onPress={toggleLanguage}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingValue}>{language}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable style={styles.settingItem} onPress={() => router.push("/settings/change-password")}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingValue}>→</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable style={styles.settingItem} onPress={() => router.push("/settings/about")}>
            <Text style={styles.settingLabel}>About Us</Text>
            <Text style={styles.settingValue}>→</Text>
          </Pressable>

          <Pressable style={styles.settingItem} onPress={() => router.push("/settings/terms")}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.settingValue}>→</Text>
          </Pressable>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
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
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#fafafa",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  settingValue: {
    fontSize: 16,
    color: "#888",
  },
  logoutButton: {
    backgroundColor: "#E50914",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
