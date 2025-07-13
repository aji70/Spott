import { Vendor } from '~/types/vendor';

export const featuredVendors: Vendor[] = [
  {
    id: '1',
    name: 'Seoul Garden',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Korean',
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Kimchi House',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Korean',
    isFeatured: true,
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Gangnam Style',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Korean',
    isFeatured: false,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'K-BBQ Delight',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Korean',
    isFeatured: false,
    rating: 4.6,
  },
];

export const topVendors: Vendor[] = [
  {
    id: '5',
    name: 'Noodle Paradise',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Asian',
    isFeatured: false,
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Pizza Corner',
    image: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Italian',
    isFeatured: true,
    rating: 4.7,
  },
  {
    id: '7',
    name: 'Burger Joint',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'American',
    isFeatured: false,
    rating: 4.5,
  },
  {
    id: '8',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Japanese',
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: '9',
    name: 'Taco Heaven',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Mexican',
    isFeatured: false,
    rating: 4.6,
  },
];

export const localVendors: Vendor[] = [
  {
    id: '10',
    name: 'Jollof Palace',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Nigerian',
    isFeatured: true,
    rating: 4.9,
  },
  {
    id: '11',
    name: 'Suya Spot',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjZ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Nigerian',
    isFeatured: false,
    rating: 4.7,
  },
  {
    id: '12',
    name: 'Amala Joint',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Nigerian',
    isFeatured: false,
    rating: 4.6,
  },
  {
    id: '13',
    name: 'Ewa Agoyin Express',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Nigerian',
    isFeatured: true,
    rating: 4.8,
  },
  {
    id: '14',
    name: 'Buka Restaurant',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    category: 'Nigerian',
    isFeatured: false,
    rating: 4.5,
  },
];