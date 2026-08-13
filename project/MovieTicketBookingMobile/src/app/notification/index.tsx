import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Booking Confirmed",
    message: "Your booking BK001 has been confirmed.",
    time: "2 hours ago",
    icon: "✅",
    unread: true,
  },
  {
    id: "2",
    title: "Showtime Update",
    message: "Avengers: Endgame showtime updated.",
    time: "1 day ago",
    icon: "⏱️",
    unread: false,
  },
  {
    id: "3",
    title: "New Movie Release",
    message: "New movie 'Interstellar' is now showing.",
    time: "3 days ago",
    icon: "🎬",
    unread: false,
  },
  {
    id: "4",
    title: "Welcome",
    message: "Welcome to Movie Ticket!",
    time: "1 week ago",
    icon: "👋",
    unread: false,
  }
];

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {MOCK_NOTIFICATIONS.map(item => (
          <View key={item.id} style={[styles.card, item.unread && styles.unreadCard]}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </View>
        ))}
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
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  unreadCard: {
    backgroundColor: "#fff9f9",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E50914",
    marginLeft: 8,
  },
});
