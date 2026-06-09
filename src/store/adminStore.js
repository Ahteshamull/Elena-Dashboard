import { create } from 'zustand';
import { chefsData } from '../constants/mockData';

const useAdminStore = create((set) => ({
  // Active Chefs (initially from mock data)
  activeChefs: chefsData.map((chef, idx) => ({
    ...chef,
    status: idx === 2 ? 'Suspended' : 'Active',
    earnings: `$${(parseInt(chef.price) * (idx + 1) * 12).toLocaleString()}`,
    joinedDate: `Oct ${12 + idx}, 2025`
  })),

  // Pending Chefs (initially from mock data in components)
  pendingChefs: [
    { 
      id: 101, 
      name: 'Chef Alessandro Rossi', 
      location: 'Rome, Italy', 
      specialty: 'Traditional Italian & Seafood',
      experience: '12 Years',
      appliedDate: 'May 12, 2026',
      documents: ['Passport', 'Food Safety Cert', 'Resume'],
      avatar: 'https://images.unsplash.com/photo-1577214450283-f3c130dcee81?auto=format&fit=crop&q=80&w=200'
    },
    { 
      id: 102, 
      name: 'Chef Sarah Jenkins', 
      location: 'London, UK', 
      specialty: 'Modern British & Pastry',
      experience: '8 Years',
      appliedDate: 'May 14, 2026',
      documents: ['ID Card', 'Liability Insurance'],
      avatar: 'https://images.unsplash.com/photo-1583394293214-28dea15ee54d?auto=format&fit=crop&q=80&w=200'
    }
  ],

  // Actions
  approveChef: (id) => set((state) => {
    const chefToApprove = state.pendingChefs.find(c => c.id === id);
    if (!chefToApprove) return state;

    const newActiveChef = {
      ...chefToApprove,
      id: state.activeChefs.length + 1,
      image: chefToApprove.avatar,
      price: '200', // Default starting price
      rating: '0.0',
      reviews: '0',
      status: 'Active',
      earnings: '$0',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      badges: [],
      tags: chefToApprove.specialty.split(' & ')
    };

    return {
      pendingChefs: state.pendingChefs.filter(c => c.id !== id),
      activeChefs: [...state.activeChefs, newActiveChef]
    };
  }),

  rejectChef: (id) => set((state) => ({
    pendingChefs: state.pendingChefs.filter(c => c.id !== id)
  })),

  toggleChefStatus: (id) => set((state) => ({
    activeChefs: state.activeChefs.map(chef => 
      chef.id === id 
        ? { ...chef, status: chef.status === 'Active' ? 'Suspended' : 'Active' }
        : chef
    )
  })),

  deleteChef: (id) => set((state) => ({
    activeChefs: state.activeChefs.filter(chef => chef.id !== id)
  })),

  // Users Management
  activeUsers: [
    { id: 1, name: 'Julian Jameson', email: 'julian.j@example.com', bookings: 12, spend: '$3,450', status: 'Active', joined: 'Jan 15, 2026' },
    { id: 2, name: 'Sophia L.', email: 'sophia.l@example.com', bookings: 5, spend: '$1,200', status: 'Active', joined: 'Feb 02, 2026' },
    { id: 3, name: 'Michael R.', email: 'm.rossi@example.com', bookings: 8, spend: '$2,100', status: 'Suspended', joined: 'Mar 10, 2026' },
    { id: 4, name: 'Emma Wilson', email: 'emma.w@example.com', bookings: 3, spend: '$850', status: 'Active', joined: 'Mar 25, 2026' },
    { id: 5, name: 'David Chen', email: 'david.c@example.com', bookings: 15, spend: '$4,200', status: 'Active', joined: 'Apr 05, 2026' },
  ],

  toggleUserStatus: (id) => set((state) => ({
    activeUsers: state.activeUsers.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' }
        : user
    )
  })),

  deleteUser: (id) => set((state) => ({
    activeUsers: state.activeUsers.filter(user => user.id !== id)
  })),

  // Platform Bookings
  platformBookings: [
    { id: 'BK-7701', userId: 1, userName: 'Julian Jameson', chefId: 1, chefName: 'Chef Julian Vasseur', date: 'May 20, 2026', amount: '$1,200', status: 'Confirmed', people: 4 },
    { id: 'BK-7702', userId: 1, userName: 'Julian Jameson', chefId: 2, chefName: 'Chef Hanae Tanaka', date: 'Apr 12, 2026', amount: '$850', status: 'Completed', people: 2 },
    { id: 'BK-7703', userId: 2, userName: 'Sophia L.', chefId: 3, chefName: 'Chef Marco Rossi', date: 'May 25, 2026', amount: '$450', status: 'Pending', people: 3 },
    { id: 'BK-7704', userId: 5, userName: 'David Chen', chefId: 4, chefName: 'Chef Elena Rodriguez', date: 'Jun 01, 2026', amount: '$2,100', status: 'Confirmed', people: 6 },
    { id: 'BK-7705', userId: 3, userName: 'Michael R.', chefId: 1, chefName: 'Chef Julian Vasseur', date: 'May 10, 2026', amount: '$900', status: 'Cancelled', people: 4 },
  ],

  updateBookingStatus: (id, status) => set((state) => ({
    platformBookings: state.platformBookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    )
  })),

  // Platform Settings
  settings: {
    platformName: 'Tableli',
    supportEmail: 'support@elenatableli.com',
    serviceFee: 15,
    minimumBooking: 100,
    maintenanceMode: false,
    notifications: {
      newChefSignup: true,
      newBooking: true,
      payoutRequests: true,
    }
  },

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  // Payout Management
  payoutRequests: [
    { id: 'PO-1001', chefId: 1, chefName: 'Chef Julian Vasseur', amount: '$2,450', method: 'Bank Transfer', requestedDate: 'May 14, 2026', status: 'Pending' },
    { id: 'PO-1002', chefId: 2, chefName: 'Chef Hanae Tanaka', amount: '$1,800', method: 'PayPal', requestedDate: 'May 12, 2026', status: 'Paid' },
    { id: 'PO-1003', chefId: 3, chefName: 'Chef Marco Rossi', amount: '$950', method: 'Bank Transfer', requestedDate: 'May 15, 2026', status: 'Pending' },
    { id: 'PO-1004', chefId: 4, chefName: 'Chef Elena Rodriguez', amount: '$3,100', method: 'Stripe', requestedDate: 'May 10, 2026', status: 'Paid' },
  ],

  processPayout: (id, status) => set((state) => ({
    payoutRequests: state.payoutRequests.map(req => 
      req.id === id ? { ...req, status } : req
    )
  }))
}));

export default useAdminStore;
