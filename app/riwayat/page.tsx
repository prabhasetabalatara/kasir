"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Receipt, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface TransactionItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Transaction {
  id: string
  items: TransactionItem[]
  total: number
  date: string
}

export default function RiwayatPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalSales = () => {
    return transactions.reduce((total, transaction) => total + transaction.total, 0)
  }

  const getTotalTransactions = () => {
    return transactions.length
  }

  const getTodayTransactions = () => {
    const today = new Date().toDateString()
    return transactions.filter((transaction) => new Date(transaction.date).toDateString() === today)
  }

  const getTodaySales = () => {
    return getTodayTransactions().reduce((total, transaction) => total + transaction.total, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Riwayat Transaksi</h1>
              <p className="text-gray-600">Lihat semua transaksi yang telah dilakukan</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {getTotalSales().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Semua waktu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalTransactions()}</div>
              <p className="text-xs text-muted-foreground">Semua waktu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penjualan Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {getTodaySales().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{getTodayTransactions().length} transaksi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata per Transaksi</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp{" "}
                {getTotalTransactions() > 0 ? Math.round(getTotalSales() / getTotalTransactions()).toLocaleString() : 0}
              </div>
              <p className="text-xs text-muted-foreground">Rata-rata</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.reverse().map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">#{transaction.id}</Badge>
                            <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">Rp {transaction.total.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{transaction.items.length} item(s)</p>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Detail Transaksi #{transaction.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-600">Tanggal</p>
                                <p className="font-medium">{formatDate(transaction.date)}</p>
                              </div>

                              <Separator />

                              <div>
                                <p className="font-medium mb-2">Item yang dibeli:</p>
                                <div className="space-y-2">
                                  {transaction.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                          {item.quantity} x Rp {item.price.toLocaleString()}
                                        </p>
                                      </div>
                                      <p className="font-medium">Rp {(item.quantity * item.price).toLocaleString()}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator />

                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">Rp {transaction.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
