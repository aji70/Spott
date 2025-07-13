export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};

export const data: Data[] = [
  {
    id: 1,
    image: require('../assets/images/onboard1.webp'),
    title: 'Local to International',
    text: 'Never let location be a barrier to your access to quality products.',
  },
  {
    id: 2,
    image: require('../assets/images/onboard2.webp'),
    title: 'Fast & Secure Delivery',
    text: 'Experience swift and reliable delivery of your products, backed by our secure shipping network.',
  },
  {
    id: 3,
    image: require('../assets/images/onboard3.webp'),
    title: 'Quality Guaranteed',
    text: 'We ensure every product meets the highest standards of quality before reaching your doorstep.',
  },
];
