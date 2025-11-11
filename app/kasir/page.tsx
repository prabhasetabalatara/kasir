"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  { id: "9", name: "Jeruk Panas", price: 8000, stock: 60, category: "Minuman" },
  { id: "10", name: "Jeruk Dingin", price: 8000, stock: 60, category: "Minuman" },
  { id: "11", name: "Air Mineral", price: 3000, stock: 150, category: "Minuman" },
  { id: "12", name: "Nasi Goreng", price: 15000, stock: 40, category: "Makanan" },
  { id: "13", name: "Mie Goreng", price: 12000, stock: 40, category: "Makanan" },
  { id: "14", name: "Nasi Kuning", price: 10000, stock: 30, category: "Makanan" },
  { id: "15", name: "Pisang Goreng", price: 8000, stock: 50, category: "Gorengan" },
  { id: "16", name: "Bakwan", price: 5000, stock: 60, category: "Gorengan" },
  { id: "17", name: "Tahu Isi", price: 6000, stock: 50, category: "Gorengan" },
  { id: "18", name: "Risoles", price: 7000, stock: 40, category: "Gorengan" },
  { id: "19", name: "Roti Bakar", price: 10000, stock: 35, category: "Gorengan" },
]

export default function KasirPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [showCart, setShowCart] = useState(false)

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
    (product) => selectedCategory === "Semua" || product.category === selectedCategory
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
    setShowCart(false)
    alert("Transaksi berhasil! Total: Rp " + getTotalPrice().toLocaleString())
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
    <Link href="/">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-white hover:bg-amber-800"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </Link>
            <div>
              <h1 className="text-xl font-bold">Kasir Warkop</h1>
              <p className="text-xs text-amber-100">Point of Sale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs - Fixed */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-all active:scale-95 cursor-pointer border-2 hover:border-amber-500"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-3">
                <Badge variant="secondary" className="text-xs mb-2">
                  {product.category}
                </Badge>
                <h3 className="font-bold text-base mb-1 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-amber-600 mb-1">
                  {(product.price / 1000).toFixed(0)}k
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                  <div className="bg-amber-600 text-white p-1.5 rounded-full">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Cart Button - Fixed */}
      {cart.length > 0 && (
        <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3">
          <Button
            onClick={() => setShowCart(true)}
            className="w-full h-14 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-lg shadow-lg"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="flex-1 text-left">
              Lihat Pesanan ({getTotalItems()})
            </span>
            <span>Rp {getTotalPrice().toLocaleString()}</span>
          </Button>
        </div>
      )}

      {/* Cart Modal - Fullscreen */}
      {showCart && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Cart Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(false)}
                  className="h-10 w-10 text-white hover:bg-amber-800"
                >
                  <X className="h-6 w-6" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold">Keranjang</h2>
                  <p className="text-xs text-amber-100">{getTotalItems()} item</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                className="text-white hover:bg-amber-800 text-xs"
              >
                Hapus Semua
              </Button>
            </div>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item) => (
              <Card key={item.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-2">
                      <h3 className="font-bold text-base mb-1">{item.name}</h3>
                      <p className="text-amber-600 font-semibold text-lg">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <span className="text-sm text-gray-600">Jumlah:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 rounded-full border-2"
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="w-12 text-center font-bold text-xl">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 rounded-full border-2"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-bold text-lg text-amber-600">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Footer - Checkout */}
          <div className="flex-shrink-0 bg-white border-t shadow-lg p-4 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-amber-600">
                Rp {getTotalPrice().toLocaleString()}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg shadow-lg"
              size="lg"
            >
              Checkout Sekarang
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
