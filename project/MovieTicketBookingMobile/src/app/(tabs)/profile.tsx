import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName || "User Name"}</Text>
          <Text style={styles.email}>{user?.email || "email@example.com"}</Text>
        </View>

        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={() => router.push("/profile/edit")}>
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push("/history")}>
            <Text style={styles.menuIcon}>🎫</Text>
            <Text style={styles.menuText}>Booking History</Text>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push("/notification")}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push("/settings")}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
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
  content: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 20,
    color: "#ccc",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E50914",
  },
});
