export const templates = {
  saas: {
    screens: [
      {
        name: "DashboardScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LayoutDashboard, Users, CreditCard } from 'lucide-react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pro-SaaS Dashboard</Text>
      <View style={styles.statsContainer}>
        <StatCard icon={<Users color="#fff" />} label="Users" value="1,234" color="#6366f1" />
        <StatCard icon={<LayoutDashboard color="#fff" />} label="Uptime" value="99.9%" color="#10b981" />
        <StatCard icon={<CreditCard color="#fff" />} label="Revenue" value="$45k" color="#f59e0b" />
      </View>
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    {icon}
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  card: { width: '30%', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  cardLabel: { color: '#e2e8f0', fontSize: 12, marginTop: 5 },
  cardValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});`,
      },
    ],
  },
  ai: {
    screens: [
      {
        name: "ChatScreen.tsx",
        content: `import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Bot, Send } from 'lucide-react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([{ id: '1', text: 'Hello! How can I help you today?', isBot: true }]);
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <Bot color="#6366f1" size={24} />
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.isBot ? styles.botMsg : styles.userMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="Ask anything..." placeholderTextColor="#94a3b8" />
        <Send color="#6366f1" size={24} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  msg: { padding: 12, borderRadius: 12, margin: 10, maxWidth: '80%' },
  botMsg: { backgroundColor: '#1e293b', alignSelf: 'flex-start' },
  userMsg: { backgroundColor: '#6366f1', alignSelf: 'flex-end' },
  msgText: { color: '#fff' },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#1e293b' },
  input: { flex: 1, color: '#fff', marginRight: 10 }
});`,
      },
    ],
  },
  social: {
    screens: [
      {
        name: "FeedScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Heart, MessageCircle, Share } from 'lucide-react-native';

const POSTS = [
  { id: '1', user: 'johndoe', text: 'Stunning sunset today!', image: 'https://picsum.photos/400/300' },
  { id: '2', user: 'jane_dev', text: 'Building the future with Pro-Expo-Kit.', image: 'https://picsum.photos/400/301' }
];

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.username}>@{item.user}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text}>{item.text}</Text>
            <View style={styles.actions}>
              <Heart color="#f8fafc" size={20} />
              <MessageCircle color="#f8fafc" size={20} style={{ marginLeft: 15 }} />
              <Share color="#f8fafc" size={20} style={{ marginLeft: 15 }} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  post: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  username: { color: '#f8fafc', fontWeight: 'bold', padding: 15 },
  image: { width: '100%', height: 300 },
  text: { color: '#e2e8f0', padding: 15 },
  actions: { flexDirection: 'row', padding: 15 }
});`,
      },
    ],
  },
  shop: {
    screens: [
      {
        name: "ShopScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ShoppingCart, ShoppingBag } from 'lucide-react-native';

const PRODUCTS = [
  { id: '1', name: 'Ultra-Stable Kit', price: '$29.99' },
  { id: '2', name: 'Pro-Expo Lens', price: '$49.99' },
];

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pro-Shop</Text>
        <ShoppingCart color="#fff" />
      </View>
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ShoppingBag color="#6366f1" size={40} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  card: { flex: 1, backgroundColor: '#1e293b', margin: 5, padding: 15, borderRadius: 12, alignItems: 'center' },
  name: { color: '#fff', marginTop: 10, fontWeight: 'bold' },
  price: { color: '#6366f1', marginTop: 5 },
  btn: { backgroundColor: '#6366f1', padding: 10, borderRadius: 8, marginTop: 10, alignSelf: 'stretch', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});`,
      },
    ],
  },
};
