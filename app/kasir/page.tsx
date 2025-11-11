"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

interface CartItem extends Product {
  quantity: number
}

const defaultProducts: Product[] = [
  { id: "1", name: "Kopi Hitam", price: 5000, stock: 100, category: "Kopi" },
  { id: "2", name: "Kopi Susu", price: 8000, stock: 100, category: "Kopi" },
  { id: "3", name: "Cappuccino", price: 12000, stock: 80, category: "Kopi" },
  { id: "4", name: "Kopi Tubruk", price: 6000, stock: 90, category: "Kopi" },
  { id: "5", name: "Es Kopi Susu", price: 10000, stock: 100, category: "Kopi" },
  { id: "6", name: "Teh Tawar", price: 3000, stock: 120, category: "Teh" },
  { id: "7", name: "Teh Manis", price: 5000, stock: 120, category: "Teh" },
  { id: "8", name: "Es Teh Manis", price: 5000, stock: 120, category: "Teh" },
  { id: "9", name: "Teh Lemon", price: 8000, stock: 80, category: "Teh" },
  { id: "10", name: "Jeruk Panas", price: 8000, stock: 60, category: "Minuman" },
  { id: "11", name: "Jeruk Dingin", price: 8000, stock: 60, category: "Minuman" },
  { id: "12", name: "Air Mineral", price: 3000, stock: 150, category: "Minuman" },
  { id: "13", name: "Nasi Goreng", price: 15000, stock: 40, category: "Makanan" },
  { id: "14", name: "Mie Goreng", price: 12000, stock: 40, category: "Makanan" },
  { id: "15", name: "Nasi Kuning", price: 10000, stock: 30, category: "Makanan" },
  { id: "16", name: "Pisang Goreng", price: 8000, stock: 50, category: "Snack" },
  { id: "17", name: "Bakwan", price: 5000, stock: 60, category: "Snack" },
  { id: "18", name: "Tahu Isi", price: 6000, stock: 50, category: "Snack" },
  { id: "19", name: "Risoles", price: 7000, stock: 40, category: "Snack" },
  { id: "20", name: "Roti Bakar", price: 10000, stock: 35, category: "Snack" },
]

export default function KasirPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  useEffect(() => {
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(defaultProducts)
      localStorage.setItem("products", JSON.stringify(defaultProducts))
    }
  }, [])

  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "Semua" || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      const product = products.find((p) => p.id === id)
      if (product && newQuantity <= product.stock) {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      }
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })

    const transaction = {
      id: Date.now().toString(),
      items: cart,
      total: getTotalPrice(),
      date: new Date().toISOString(),
    }

    const savedTransactions = localStorage.getItem("transactions")
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : []
    transactions.push(transaction)

    localStorage.setItem("transactions", JSON.stringify(transactions))
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    setProducts(updatedProducts)
    setCart([])
    alert("Transaksi berhasil!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-3 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Kasir Warkop</h1>
            <p className="text-xs sm:text-sm text-gray-600">Proses transaksi penjualan</p>
          </div>
        </div>

        {/* Cart Section - Sekarang di atas */}
        {cart.length > 0 && (
          <Card className="mb-4 sm:mb-6 bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="flex items-center">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Keranjang ({getTotalItems()})
                </span>
                <span className="text-green-600">Rp {getTotalPrice().toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Rp {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-red-600"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleCheckout} className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold" size="lg">
                Checkout - Rp {getTotalPrice().toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Products Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg mb-3">Daftar Menu</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-2 sm:p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{product.name}</h3>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-green-600 mb-1">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">Stok: {product.stock}</p>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full h-8 sm:h-9 text-xs sm:text-sm"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Tambah
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
