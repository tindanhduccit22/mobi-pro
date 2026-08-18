import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Booking and Payments</Text>
          <Text style={styles.paragraph}>
            All ticket bookings are subject to availability. Payments must be made in full at the time of booking. 
            We accept various payment methods including Credit Cards and e-Wallets.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Cancellation Policy</Text>
          <Text style={styles.paragraph}>
            Tickets once purchased cannot be cancelled or refunded unless the show is cancelled by the cinema management.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. We collect and store your personal information securely and do not share it with third parties without your consent.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
  }
});
