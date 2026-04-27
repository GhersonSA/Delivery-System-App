import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { fetchProducts } from './src/services/products.service';
import { useCartStore } from './src/store/cart.store';
import { useSubmitOrder } from './src/hooks/useSubmitOrder';

const queryClient = new QueryClient();

function toMoney(value: number): string {
  return value.toFixed(2);
}

function KioskScreen() {
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.getTotal());

  const submitOrder = useSubmitOrder();

  const onCreateOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacio', 'Agrega productos antes de enviar el pedido.');
      return;
    }

    try {
      const order = await submitOrder.mutateAsync();
      Alert.alert('Pedido enviado', `Pedido ${order.id} enviado a cocina.`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear el pedido.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kiosco Movil</Text>
        <Text style={styles.headerSubtitle}>Delivery System App</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <Pressable style={styles.smallButton} onPress={() => void refetch()}>
            <Text style={styles.smallButtonText}>Recargar</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#f97316" />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>No hay productos. Crea algunos en la base de datos.</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.category}</Text>
                  <Text style={styles.itemPrice}>S/. {toMoney(Number(item.price))}</Text>
                </View>
                <Pressable
                  style={styles.addButton}
                  onPress={() =>
                    addItem({
                      productId: item.id,
                      name: item.name,
                      unitPrice: Number(item.price),
                    })
                  }
                >
                  <Text style={styles.addButtonText}>Agregar</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carrito</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Aun no hay productos en el carrito.</Text>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>S/. {toMoney(item.unitPrice * item.quantity)}</Text>
                </View>
                <Pressable style={styles.removeButton} onPress={() => removeItem(item.productId)}>
                  <Text style={styles.removeButtonText}>Quitar</Text>
                </Pressable>
              </View>
            )}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: S/. {toMoney(total)}</Text>
          <Pressable
            style={[styles.sendButton, submitOrder.isPending && styles.sendButtonDisabled]}
            onPress={() => void onCreateOrder()}
            disabled={submitOrder.isPending}
          >
            <Text style={styles.sendButtonText}>
              {submitOrder.isPending ? 'Enviando...' : 'Enviar Pedido'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KioskScreen />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  section: {
    flex: 1,
    marginBottom: 12,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  smallButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  list: {
    flexGrow: 0,
  },
  itemCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  itemMeta: {
    color: '#94a3b8',
    marginTop: 2,
  },
  itemPrice: {
    color: '#facc15',
    marginTop: 2,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#ea580c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  removeButton: {
    backgroundColor: '#b91c1c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    gap: 10,
  },
  totalText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  sendButton: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#cbd5e1',
  },
});
