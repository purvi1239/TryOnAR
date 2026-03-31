import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// Assuming these are correctly defined in your project
import { searchProducts } from "../api/productApi"; 
import { Product } from "../types/product";

const Ecommerce = () => {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.length > 2) {
      setLoading(true);
      try {
        const result = await searchProducts(text);
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts([]);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {/* Assuming item.image is a valid URL string */}
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Ecommerce Search</Text>

      <TextInput
        placeholder="Search products..."
        value={query}
        onChangeText={handleSearch}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        // Optional: Add a message when no products are found
        ListEmptyComponent={
            !loading && query.length > 2 ? (
                <Text style={styles.emptyText}>No products found.</Text>
            ) : null
        }
      />
    </View>
  );
};

// --- Missing Styles Block Added Here ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40, // Adds top margin to avoid iOS notch/Android status bar
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee', // Shows while image is loading
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e8b57', // A nice green color for price
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  }
});

export default Ecommerce;