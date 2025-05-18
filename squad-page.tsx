"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, UserPlus, Clock, MapPin, ChevronRight, Users, User, X, Check, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock data for friends
const friendsData = [
  {
    id: 1,
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    status: "active",
    lastActive: "Just now",
    favorite: true,
  },
  {
    id: 2,
    name: "Sam Taylor",
    username: "@samtaylor",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ST",
    status: "active",
    lastActive: "5m ago",
    favorite: true,
  },
  {
    id: 3,
    name: "Jamie Smith",
    username: "@jamiesmith",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    status: "away",
    lastActive: "1h ago",
    favorite: false,
  },
  {
    id: 4,
    name: "Casey Wilson",
    username: "@caseyw",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CW",
    status: "inactive",
    lastActive: "3h ago",
    favorite: false,
  },
  {
    id: 5,
    name: "Riley Brown",
    username: "@rileyb",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RB",
    status: "inactive",
    lastActive: "1d ago",
    favorite: false,
  },
]

// Mock data for friend groups
const friendGroupsData = [
  {
    id: 1,
    name: "Close Friends",
    count: 5,
    members: friendsData.slice(0, 5),
  },
  {
    id: 2,
    name: "Study Buddies",
    count: 3,
    members: friendsData.slice(0, 3),
  },
  {
    id: 3,
    name: "Work Friends",
    count: 4,
    members: friendsData.slice(1, 5),
  },
]

// Mock data for friend requests
const friendRequestsData = [
  {
    id: 1,
    name: "Jordan Lee",
    username: "@jordanl",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JL",
    mutualFriends: 3,
  },
  {
    id: 2,
    name: "Taylor Reed",
    username: "@taylorreed",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TR",
    mutualFriends: 1,
  },
]

// Mock data for recent ketchups
const recentKetchupsData = [
  {
    id: 1,
    friend: {
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    place: "Blue Bottle Coffee",
    time: "Yesterday",
    activity: "Coffee",
  },
  {
    id: 2,
    friend: {
      name: "Sam",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ST",
    },
    place: "Central Park",
    time: "Last week",
    activity: "Walk",
  },
]

interface SquadPageProps {
  onKetchup?: (friendId: number) => void
}

export default function SquadPage({ onKetchup }: SquadPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [friendRequests, setFriendRequests] = useState(friendRequestsData)
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null)
  const { toast } = useToast()

  const filteredFriends = friendsData.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAcceptRequest = (id: number) => {
    toast({
      title: "Friend request accepted!",
      description: "You're now connected",
    })
    setFriendRequests(friendRequests.filter((request) => request.id !== id))
  }

  const handleRejectRequest = (id: number) => {
    toast({
      title: "Friend request declined",
    })
    setFriendRequests(friendRequests.filter((request) => request.id !== id))
  }

  const handleQuickKetchup = (friendId: number) => {
    if (onKetchup) {
      onKetchup(friendId)
    } else {
      const friend = friendsData.find((f) => f.id === friendId)
      if (friend) {
        toast({
          title: `Ketchup request sent to ${friend.name}! 🍅`,
          description: "They'll get a notification right away",
        })
      }
    }
    setSelectedFriend(null)
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ketchup-800 mb-2">your squad</h1>
        <p className="text-gray-600 text-sm">manage your friends & groups</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-ketchup-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="pl-10 py-6 text-base border-gray-200 bg-cream-50 focus:bg-white transition-colors rounded-xl shadow-sm focus:shadow-md"
        />
      </div>

      {/* Add Friend Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button className="w-full mb-6 bg-ketchup-700 hover:bg-ketchup-800 text-white rounded-xl py-6 shadow-md">
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Friend
        </Button>
      </motion.div>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-ketchup-800 mb-4">friend requests</h3>
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 rounded-2xl border-0 shadow-md overflow-hidden">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border-2 border-cream-100">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                      <AvatarFallback className="bg-cream-100 text-ketchup-700">{request.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{request.name}</h4>
                      <p className="text-sm text-gray-500">{request.username}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{request.mutualFriends} mutual friends</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        className="flex-1 bg-ketchup-700 hover:bg-ketchup-800 text-white rounded-xl shadow-md"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="friends" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-cream-50">
          <TabsTrigger
            value="friends"
            className="data-[state=active]:bg-white data-[state=active]:text-ketchup-700 data-[state=active]:shadow-sm"
          >
            Friends
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-white data-[state=active]:text-ketchup-700 data-[state=active]:shadow-sm"
          >
            Groups
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-white data-[state=active]:text-ketchup-700 data-[state=active]:shadow-sm"
          >
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <motion.div
                key={friend.id}
                whileHover={{ x: 5 }}
                className="cursor-pointer"
                onClick={() => setSelectedFriend(friend.id)}
              >
                <Card className="p-4 rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="h-12 w-12 mr-3 border-2 border-cream-100">
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                        <AvatarFallback className="bg-cream-100 text-ketchup-700">{friend.initials}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white ${
                          friend.status === "active"
                            ? "bg-green-500"
                            : friend.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                        }`}
                      ></div>
                      {friend.favorite && (
                        <div className="absolute -top-1 -right-1 bg-ketchup-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                          ★
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{friend.name}</h4>
                        <div className="flex space-x-1">
                          {friend.status === "active" && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">Available</Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{friend.username}</span>
                        <span className="mx-1">•</span>
                        <span>{friend.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="space-y-3">
            {friendGroupsData.map((group) => (
              <motion.div key={group.id} whileHover={{ x: 5 }} className="cursor-pointer">
                <Card className="p-4 rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center">
                    <div className="h-12 w-12 mr-3 bg-cream-100 rounded-full flex items-center justify-center shadow-sm">
                      <Users className="h-6 w-6 text-ketchup-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{group.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="h-8 rounded-full">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span className="text-xs">Ketchup</span>
                          </Button>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{group.count} members</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    {group.members.slice(0, 5).map((member, index) => (
                      <div key={member.id} className="relative" style={{ marginLeft: index > 0 ? "-8px" : "0" }}>
                        <Avatar className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                        {member.status === "active" && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white"></div>
                        )}
                      </div>
                    ))}
                    {group.count > 5 && <span className="text-xs text-gray-500 ml-2">+{group.count - 5} more</span>}
                  </div>
                </Card>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant="outline"
                className="w-full rounded-xl border-dashed border-2 py-6 text-gray-500 hover:text-ketchup-700 hover:border-ketchup-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Group
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-3">
            {recentKetchupsData.map((ketchup) => (
              <motion.div
                key={ketchup.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="p-4 rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border-2 border-cream-100">
                      <AvatarImage src={ketchup.friend.avatar || "/placeholder.svg"} alt={ketchup.friend.name} />
                      <AvatarFallback className="bg-cream-100 text-ketchup-700">
                        {ketchup.friend.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Ketchup with <span className="text-ketchup-700">{ketchup.friend.name}</span>
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <div className="flex items-center mr-3">
                          <ActivityIcon activity={ketchup.activity} className="h-4 w-4 mr-1 text-ketchup-500" />
                          {ketchup.activity}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-ketchup-500" />
                          {ketchup.time}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-ketchup-500" />
                        {ketchup.place}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-ketchup-700 hover:bg-ketchup-800 text-white">
                      Repeat Ketchup
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {recentKetchupsData.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍅</span>
                </div>
                <p className="font-medium text-ketchup-800">no recent ketchups</p>
                <p className="text-sm mt-2 text-gray-500">start one to connect with your squad</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Friend Action Popover */}
      <AnimatePresence>
        {selectedFriend !== null && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 left-0 right-0 z-50 px-4"
          >
            <Card className="rounded-2xl border-0 shadow-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={friendsData.find((f) => f.id === selectedFriend)?.avatar || "/placeholder.svg"}
                      alt="Friend"
                    />
                    <AvatarFallback>{friendsData.find((f) => f.id === selectedFriend)?.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{friendsData.find((f) => f.id === selectedFriend)?.name}</h4>
                    <p className="text-xs text-gray-500">
                      {friendsData.find((f) => f.id === selectedFriend)?.status === "active"
                        ? "Available now"
                        : "Not available"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedFriend(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  className="flex flex-col items-center justify-center h-20 bg-ketchup-700 hover:bg-ketchup-800 text-white rounded-xl shadow-md"
                  onClick={() => handleQuickKetchup(selectedFriend)}
                >
                  <MessageSquare className="h-6 w-6 mb-1" />
                  <span className="text-xs">Ketchup</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center h-20 rounded-xl">
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-xs">Profile</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center justify-center h-20 rounded-xl">
                  <Users className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add to Group</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper component to show different activity icons
function ActivityIcon({ activity, className }: { activity: string; className?: string }) {
  switch (activity.toLowerCase()) {
    case "coffee":
      return <span className={className}>☕</span>
    case "lunch":
    case "dinner":
      return <span className={className}>🍽️</span>
    case "study":
      return <span className={className}>📚</span>
    case "walk":
      return <span className={className}>🚶</span>
    case "drinks":
      return <span className={className}>🍹</span>
    default:
      return <User className={className} />
  }
}
