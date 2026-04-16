export const templates = {
  saas: {
    screens: [
      {
        name: "DashboardScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LayoutDashboard, Users, CreditCard, ArrowUpRight, ShieldCheck } from 'lucide-react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.header}>Pro-SaaS Analytics</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard icon={<Users color="#fff" size={20} />} label="Active Users" value="12,842" color="#6366f1" trend="+12%" />
        <StatCard icon={<CreditCard color="#fff" size={20} />} label="MRR" value="$48,200" color="#10b981" trend="+5.4%" />
        <StatCard icon={<ShieldCheck color="#fff" size={20} />} label="Security" value="Active" color="#f59e0b" />
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <ActivityItem title="New Subscription" user="Premium User #42" time="2m ago" price="+$29.00" />
      <ActivityItem title="System Update" user="Auto-Deploy" time="1h ago" status="Success" />

      <TouchableOpacity style={styles.upgradeBtn}>
        <Text style={styles.upgradeText}>Upgrade to Enterprise</Text>
        <ArrowUpRight color="#fff" size={18} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color, trend }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={[styles.iconWrapper, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    {trend && <Text style={styles.trendText}>{trend}</Text>}
  </View>
);

const ActivityItem = ({ title, user, time, price, status }) => (
  <View style={styles.activityCard}>
    <View>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityUser}>{user} • {time}</Text>
    </View>
    {price && <Text style={styles.activityPrice}>{price}</Text>}
    {status && <Text style={styles.activityStatus}>{status}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  headerSection: { marginBottom: 30 },
  greeting: { color: '#94a3b8', fontSize: 16 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { width: '31%', padding: 15, borderRadius: 16, backgroundColor: '#1e293b', borderLeftWidth: 4 },
  iconWrapper: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardLabel: { color: '#94a3b8', fontSize: 11, marginBottom: 4 },
  cardValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  trendText: { color: '#10b981', fontSize: 10, marginTop: 4 },
  sectionTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  activityCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1e293b', borderRadius: 12, marginBottom: 10 },
  activityTitle: { color: '#f8fafc', fontWeight: 'bold' },
  activityUser: { color: '#94a3b8', fontSize: 12 },
  activityPrice: { color: '#10b981', fontWeight: 'bold' },
  activityStatus: { color: '#6366f1', fontSize: 12 },
  upgradeBtn: { backgroundColor: '#6366f1', padding: 18, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  upgradeText: { color: '#fff', fontWeight: 'bold', marginRight: 8 }
});`,
      },
    ],
  },
  ai: {
    screens: [
      {
        name: "ChatScreen.tsx",
        content: `import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Bot, Send, Sparkles, Wand2 } from 'lucide-react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your Pro-Expo AI. How can I assist you in building your app today?', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simple mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now()+1).toString(), 
        text: "That's a great idea! I can help you implement that logic using Pro-Expo standards.", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
            <View style={styles.botIcon}><Bot color="#fff" size={20} /></View>
            <View>
                <Text style={styles.headerTitle}>Pro AI Assistant</Text>
                <Text style={styles.headerStatus}>Online • SDK 54 Expert</Text>
            </View>
        </View>
        <Sparkles color="#6366f1" size={20} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.isBot ? styles.botMsg : styles.userMsg]}>
            <Text style={[styles.msgText, !item.isBot && styles.userText]}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.actionBtn}><Wand2 color="#94a3b8" size={20} /></TouchableOpacity>
        <TextInput 
            style={styles.input} 
            placeholder="Describe your feature..." 
            placeholderTextColor="#94a3b8"
            value={input}
            onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Send color="#fff" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  botIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  headerStatus: { color: '#10b981', fontSize: 10 },
  chatList: { padding: 15 },
  msg: { padding: 15, borderRadius: 20, marginVertical: 6, maxWidth: '85%' },
  botMsg: { backgroundColor: '#1e293b', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userMsg: { backgroundColor: '#6366f1', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgText: { color: '#e2e8f0', lineHeight: 20 },
  userText: { color: '#fff' },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 15, paddingBottom: 35, borderTopWidth: 1, borderTopColor: '#1e293b' },
  actionBtn: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingHorizontal: 10 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' }
});`,
      },
    ],
  },
  social: {
    screens: [
      {
        name: "FeedScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from 'lucide-react-native';

const POSTS = [
  { id: '1', user: 'alex_dev', avatar: 'https://i.pravatar.cc/100?u=1', text: 'Just shipped my first app using @proexpo-kit! The DX is incredible. 🚀', image: 'https://picsum.photos/600/400?random=1', likes: '1.2k' },
  { id: '2', user: 'design_morph', avatar: 'https://i.pravatar.cc/100?u=2', text: 'Architecture is the soul of software. Always build on solid foundations.', image: null, likes: '840' }
];

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pro-Feed</Text>
        <TouchableOpacity style={styles.profileCircle} />
      </View>
      
      <FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.username}>{item.user}</Text>
              </View>
              <MoreHorizontal color="#94a3b8" size={20} />
            </View>

            <Text style={styles.postText}>{item.text}</Text>
            
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}

            <View style={styles.actions}>
              <View style={styles.mainActions}>
                <TouchableOpacity style={styles.actionBtn}><Heart color="#f8fafc" size={22} /><Text style={styles.actionCount}>{item.likes}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><MessageCircle color="#f8fafc" size={22} /></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><Share color="#f8fafc" size={22} /></TouchableOpacity>
              </View>
              <Bookmark color="#f8fafc" size={22} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#0f172a' },
  headerTitle: { color: '#f8fafc', fontSize: 24, fontWeight: 'bold' },
  profileCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#6366f1' },
  post: { marginBottom: 15, backgroundColor: '#1e293b', borderRadius: 0 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  username: { color: '#f8fafc', fontWeight: 'bold' },
  postText: { color: '#e2e8f0', paddingHorizontal: 15, paddingBottom: 15, lineHeight: 22 },
  postImage: { width: '100%', height: 300, backgroundColor: '#0f172a' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  mainActions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionCount: { color: '#94a3b8', marginLeft: 6, fontSize: 12 }
});`,
      },
    ],
  },
  shop: {
    screens: [
      {
        name: "ShopScreen.tsx",
        content: `import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { ShoppingCart, ShoppingBag, Star, Filter } from 'lucide-react-native';

const PRODUCTS = [
  { id: '1', name: 'Ultra-Stable Kit', price: '$29.99', image: 'https://picsum.photos/300/300?r=1', rating: '4.8' },
  { id: '2', name: 'Pro-Expo Lens', price: '$49.99', image: 'https://picsum.photos/300/300?r=2', rating: '4.9' },
  { id: '3', name: 'Dev-Case Turbo', price: '$19.00', image: 'https://picsum.photos/300/300?r=3', rating: '4.5' },
  { id: '4', name: 'Cloud Sync Box', price: '$89.99', image: 'https://picsum.photos/300/300?r=4', rating: '5.0' },
];

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text style={styles.headerSubtitle}>Discover</Text>
            <Text style={styles.headerTitle}>Pro-Shop</Text>
        </View>
        <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}><Filter color="#fff" size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.cartBtn}>
                <ShoppingCart color="#fff" size={20} />
                <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.ratingBox}>
                <Star color="#f59e0b" fill="#f59e0b" size={10} />
                <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
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
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 20, paddingTop: 60, marginBottom: 10 },
  headerSubtitle: { color: '#94a3b8', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row' },
  iconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cartBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#6366f1' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  list: { padding: 10 },
  card: { flex: 1, backgroundColor: '#1e293b', margin: 8, padding: 12, borderRadius: 20 },
  image: { width: '100%', height: 120, borderRadius: 14, backgroundColor: '#0f172a' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { color: '#f59e0b', fontSize: 10, marginLeft: 4, fontWeight: 'bold' },
  name: { color: '#fff', marginTop: 8, fontWeight: 'bold', fontSize: 14 },
  price: { color: '#6366f1', marginTop: 4, fontWeight: 'bold' },
  btn: { backgroundColor: '#6366f1', padding: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});`,
      },
    ],
  },
};
