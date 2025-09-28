import { Injectable } from '@angular/core';
import { of, Observable, delay } from 'rxjs';
import { User } from '../models/user.model';
import { Assembler } from '../models/assembler.model';
import { Service } from '../models/service.model';
import { Booking } from '../models/booking.model';
import { Category } from '../models/category.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'password',
      phone: '123-456-7890',
      address: '123 Main St, City',
      role: 'customer',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'assembler@example.com',
      password: 'password',
      phone: '987-654-3210',
      address: '456 Oak St, Town',
      role: 'assembler',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    }
  ];

  private assemblers: Assembler[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: 'password',
      phone: '079-123-4567',
      address: 'Amman, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      specialization: 'Plumbing & Water Systems',
      description: 'Certified plumber with 15 years of experience in residential and commercial plumbing. Specializes in pipe installation, leak repair, and bathroom renovations.',
      averageRating: 4.7,
      profileImage: '/assets/assemblers/ahmed.jpg',
      coverImage: '/assets/assemblers/ahmed-cover.jpg',
      location: 'Amman, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '2',
      name: 'Tariq Al-Mahmoud',
      email: 'tariq@example.com',
      password: 'password',
      phone: '079-234-5678',
      address: 'Irbid, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-02-10'),
      specialization: 'Electrical Work',
      description: 'Licensed electrician with 12 years of experience in residential and commercial electrical work. Specializes in wiring, outlets, and electrical panel upgrades.',
      averageRating: 4.8,
      profileImage: '/assets/assemblers/tariq.jpg',
      coverImage: '/assets/assemblers/tariq-cover.jpg',
      location: 'Irbid, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '07:00', end: '16:00', available: true },
        tuesday: { start: '07:00', end: '16:00', available: true },
        wednesday: { start: '07:00', end: '16:00', available: true },
        thursday: { start: '07:00', end: '16:00', available: true },
        friday: { start: '07:00', end: '14:00', available: true },
        saturday: { start: '08:00', end: '15:00', available: true },
        sunday: { start: '08:00', end: '15:00', available: true }
      }
    },
    {
      id: '3',
      name: 'Omar Farouk',
      email: 'omar@example.com',
      password: 'password',
      phone: '079-345-6789',
      address: 'Zarqa, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-03-05'),
      updatedAt: new Date('2023-03-05'),
      specialization: 'Painting & Decorating',
      description: 'Professional painter with 12 years of experience. Interior and exterior painting, wallpapering, and decorative finishes for homes and businesses.',
      averageRating: 4.5,
      profileImage: '/assets/assemblers/omar.jpg',
      coverImage: '/assets/assemblers/omar-cover.jpg',
      location: 'Zarqa, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '4',
      name: 'Mohammed Ali',
      email: 'mohammed@example.com',
      password: 'password',
      phone: '079-456-7890',
      address: 'Aqaba, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-04-10'),
      specialization: 'Carpentry & Woodwork',
      description: 'Master carpenter specializing in custom furniture, cabinet making, and home renovations. Attention to detail and quality craftsmanship guaranteed.',
      averageRating: 4.9,
      profileImage: '/assets/assemblers/mohammed.jpg',
      coverImage: '/assets/assemblers/mohammed-cover.jpg',
      location: 'Aqaba, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '5',
      name: 'Youssef Khalid',
      email: 'youssef@example.com',
      password: 'password',
      phone: '079-567-8901',
      address: 'Salt, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-05-05'),
      updatedAt: new Date('2023-05-05'),
      specialization: 'Flooring & Tiling',
      description: 'Professional tiler with expertise in ceramic, porcelain, and stone tiles. Specializing in bathrooms, kitchens, and flooring installations.',
      averageRating: 4.8,
      profileImage: '/assets/assemblers/youssef.jpg',
      coverImage: '/assets/assemblers/youssef-cover.jpg',
      location: 'Salt, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '6',
      name: 'Ibrahim Nasser',
      email: 'ibrahim@example.com',
      password: 'password',
      phone: '079-678-9012',
      address: 'Madaba, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-06-15'),
      specialization: 'HVAC & Climate',
      description: 'HVAC specialist with expertise in heating, ventilation, and air conditioning systems. Installation, repair, and maintenance services.',
      averageRating: 4.6,
      profileImage: '/assets/assemblers/ibrahim.jpg',
      coverImage: '/assets/assemblers/ibrahim-cover.jpg',
      location: 'Madaba, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '7',
      name: 'Kamal Jamal',
      email: 'kamal@example.com',
      password: 'password',
      phone: '079-789-0123',
      address: 'Karak, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-07-20'),
      updatedAt: new Date('2023-07-20'),
      specialization: 'Roofing & Gutters',
      description: 'Professional roofer with expertise in all types of roofing materials, repairs, and gutter installation. Weatherproofing and maintenance services.',
      averageRating: 4.7,
      profileImage: '/assets/assemblers/kamal.jpg',
      coverImage: '/assets/assemblers/kamal-cover.jpg',
      location: 'Karak, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '8',
      name: 'Nadia Khan',
      email: 'nadia@example.com',
      password: 'password',
      phone: '079-890-1234',
      address: 'Mafraq, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-08-10'),
      updatedAt: new Date('2023-08-10'),
      specialization: 'Kitchen & Bathroom',
      description: 'Specialist in kitchen and bathroom remodeling. Complete renovation services including plumbing, electrical, tiling, and fixture installation.',
      averageRating: 4.8,
      profileImage: '/assets/assemblers/nadia.jpg',
      coverImage: '/assets/assemblers/nadia-cover.jpg',
      location: 'Mafraq, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '9',
      name: 'Zain Malik',
      email: 'zain@example.com',
      password: 'password',
      phone: '079-901-2345',
      address: 'Tafilah, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-09-05'),
      updatedAt: new Date('2023-09-05'),
      specialization: 'Smart Home',
      description: 'Smart home expert specializing in device installation, automation, and network integration. Create your intelligent living space.',
      averageRating: 4.8,
      profileImage: '/assets/assemblers/zain.jpg',
      coverImage: '/assets/assemblers/zain-cover.jpg',
      location: 'Tafilah, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    },
    {
      id: '10',
      name: 'Sami Al-Rashid',
      email: 'sami@example.com',
      password: 'password',
      phone: '079-012-3456',
      address: 'Ajloun, Jordan',
      role: 'assembler',
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2023-10-15'),
      specialization: 'General Maintenance',
      description: 'Experienced handyman providing general home repair and maintenance services. Door repairs, window fixes, minor plumbing, electrical work, and more.',
      averageRating: 4.5,
      profileImage: '/assets/assemblers/sami.jpg',
      coverImage: '/assets/assemblers/sami-cover.jpg',
      location: 'Ajloun, Jordan',
      isVerified: true,
      availability: {
        monday: { start: '08:00', end: '17:00', available: true },
        tuesday: { start: '08:00', end: '17:00', available: true },
        wednesday: { start: '08:00', end: '17:00', available: true },
        thursday: { start: '08:00', end: '17:00', available: true },
        friday: { start: '08:00', end: '15:00', available: true },
        saturday: { start: '09:00', end: '16:00', available: true },
        sunday: { start: '09:00', end: '16:00', available: false }
      }
    }
  ];

  private services: Service[] = [
    // Plumbing & Water Services
    {
      id: '1',
      name: 'Plumbing Services',
      description: 'Professional plumbing installation, repair, and maintenance for residential and commercial properties. Includes pipe fitting, faucet installation, leak repairs, water heater services, and drain cleaning.',
      imageUrl: '/assets/services/plumbing.jpg',
      price: 25,
      categoryId: '1',
      categoryName: 'Plumbing & Water',
      assemblerId: '1',
      averageRating: 4.7,
      reviewCount: 32
    },
    {
      id: '13',
      name: 'Water Heater Installation',
      description: 'Professional water heater installation, repair, and maintenance. Gas and electric water heaters, tankless systems, and energy-efficient models.',
      imageUrl: '/assets/services/water-heater.jpg',
      price: 35,
      categoryId: '1',
      categoryName: 'Plumbing & Water',
      assemblerId: '2',
      averageRating: 4.8,
      reviewCount: 18
    },
    {
      id: '14',
      name: 'Pipe Leak Repair',
      description: 'Emergency pipe leak detection and repair services. Water damage prevention, pipe replacement, and plumbing system maintenance.',
      imageUrl: '/assets/services/pipe-repair.jpg',
      price: 20,
      categoryId: '1',
      categoryName: 'Plumbing & Water',
      assemblerId: '3',
      averageRating: 4.6,
      reviewCount: 25
    },
    // Electrical Work Services
    {
      id: '2',
      name: 'Electrical Work',
      description: 'Licensed electrical services including outlet installation, lighting fixtures, circuit breaker repairs, electrical panel upgrades, and smart home wiring. All work meets safety standards.',
      imageUrl: '/assets/services/electrical.jpg',
      price: 30,
      categoryId: '2',
      categoryName: 'Electrical Work',
      assemblerId: '4',
      averageRating: 4.8,
      reviewCount: 28
    },
    {
      id: '15',
      name: 'Lighting Installation',
      description: 'Professional lighting installation including chandeliers, recessed lighting, outdoor lighting, and smart lighting systems.',
      imageUrl: '/assets/services/lighting.jpg',
      price: 25,
      categoryId: '2',
      categoryName: 'Electrical Work',
      assemblerId: '5',
      averageRating: 4.7,
      reviewCount: 22
    },
    {
      id: '16',
      name: 'Electrical Panel Upgrade',
      description: 'Electrical panel upgrades, circuit breaker installation, and electrical system modernization for improved safety and capacity.',
      imageUrl: '/assets/services/electrical-panel.jpg',
      price: 50,
      categoryId: '2',
      categoryName: 'Electrical Work',
      assemblerId: '6',
      averageRating: 4.9,
      reviewCount: 15
    },
    // Painting & Decorating Services
    {
      id: '3',
      name: 'Painting Services',
      description: 'Interior and exterior painting services with high-quality materials and professional finish. Includes color consultation, surface preparation, primer application, and cleanup.',
      imageUrl: '/assets/services/painting.jpg',
      price: 22,
      categoryId: '3',
      categoryName: 'Painting & Decorating',
      assemblerId: '7',
      averageRating: 4.5,
      reviewCount: 35
    },
    {
      id: '17',
      name: 'Wallpaper Installation',
      description: 'Professional wallpaper installation and removal services. Pattern matching, surface preparation, and seamless installation.',
      imageUrl: '/assets/services/wallpaper.jpg',
      price: 18,
      categoryId: '3',
      categoryName: 'Painting & Decorating',
      assemblerId: '8',
      averageRating: 4.4,
      reviewCount: 12
    },
    // Carpentry & Woodwork Services
    {
      id: '4',
      name: 'Carpentry Work',
      description: 'Custom furniture making, installation, and repair services for all your woodworking needs. Includes custom shelving, cabinet installation, furniture assembly, and trim work.',
      imageUrl: '/assets/services/carpentry.jpg',
      price: 28,
      categoryId: '4',
      categoryName: 'Carpentry & Woodwork',
      assemblerId: '9',
      averageRating: 4.9,
      reviewCount: 28
    },
    {
      id: '18',
      name: 'Cabinet Installation',
      description: 'Professional cabinet installation and customization. Kitchen cabinets, bathroom vanities, and storage solutions.',
      imageUrl: '/assets/services/cabinets.jpg',
      price: 35,
      categoryId: '4',
      categoryName: 'Carpentry & Woodwork',
      assemblerId: '10',
      averageRating: 4.8,
      reviewCount: 20
    },
    // Flooring & Tiling Services
    {
      id: '5',
      name: 'Tiling Services',
      description: 'Professional tile installation for floors, walls, backsplashes, and bathrooms. Includes grouting, sealing, pattern design consultation, and waterproofing.',
      imageUrl: '/assets/services/tiling.jpg',
      price: 24,
      categoryId: '5',
      categoryName: 'Flooring & Tiling',
      assemblerId: '1',
      averageRating: 4.8,
      reviewCount: 21
    },
    {
      id: '7',
      name: 'Flooring Installation',
      description: 'Professional flooring installation including hardwood, laminate, vinyl, and carpet. Includes subfloor preparation, underlayment, and finishing touches.',
      imageUrl: '/assets/services/flooring.jpg',
      price: 26,
      categoryId: '5',
      categoryName: 'Flooring & Tiling',
      assemblerId: '2',
      averageRating: 4.7,
      reviewCount: 19
    },
    // HVAC & Climate Services
    {
      id: '6',
      name: 'HVAC Services',
      description: 'Heating, ventilation, and air conditioning installation, repair, and maintenance. Includes ductwork, thermostat installation, system optimization, and filter replacement.',
      imageUrl: '/assets/services/hvac.jpg',
      price: 32,
      categoryId: '6',
      categoryName: 'HVAC & Climate',
      assemblerId: '3',
      averageRating: 4.6,
      reviewCount: 24
    },
    {
      id: '19',
      name: 'Air Conditioning Repair',
      description: 'AC unit repair, maintenance, and installation services. Emergency repairs, filter changes, and system optimization.',
      imageUrl: '/assets/services/ac-repair.jpg',
      price: 28,
      categoryId: '6',
      categoryName: 'HVAC & Climate',
      assemblerId: '4',
      averageRating: 4.7,
      reviewCount: 16
    },
    // Roofing & Gutters Services
    {
      id: '8',
      name: 'Roofing Services',
      description: 'Complete roofing services including repairs, replacement, and maintenance. All types of roofing materials, weatherproofing solutions, and gutter installation.',
      imageUrl: '/assets/services/roofing.jpg',
      price: 40,
      categoryId: '7',
      categoryName: 'Roofing & Gutters',
      assemblerId: '5',
      averageRating: 4.8,
      reviewCount: 16
    },
    {
      id: '20',
      name: 'Gutter Installation',
      description: 'Gutter installation, repair, and maintenance services. Downspout installation, gutter cleaning, and water management solutions.',
      imageUrl: '/assets/services/gutters.jpg',
      price: 25,
      categoryId: '7',
      categoryName: 'Roofing & Gutters',
      assemblerId: '6',
      averageRating: 4.6,
      reviewCount: 14
    },
    // Kitchen & Bathroom Services
    {
      id: '9',
      name: 'Kitchen Remodeling',
      description: 'Complete kitchen renovation services including cabinet installation, countertop fitting, appliance installation, plumbing connections, and electrical work.',
      imageUrl: '/assets/services/kitchen.jpg',
      price: 50,
      categoryId: '8',
      categoryName: 'Kitchen & Bathroom',
      assemblerId: '7',
      averageRating: 4.9,
      reviewCount: 22
    },
    {
      id: '10',
      name: 'Bathroom Renovation',
      description: 'Full bathroom remodeling including plumbing, electrical, tiling, and fixture installation. Complete design and installation services with waterproofing.',
      imageUrl: '/assets/services/bathroom.jpg',
      price: 43,
      categoryId: '8',
      categoryName: 'Kitchen & Bathroom',
      assemblerId: '8',
      averageRating: 4.7,
      reviewCount: 18
    },
    // Smart Home Services
    {
      id: '12',
      name: 'Smart Home Installation',
      description: 'Smart home device installation and setup including smart lights, thermostats, security systems, home automation, and network configuration.',
      imageUrl: '/assets/services/smart-home.jpg',
      price: 30,
      categoryId: '9',
      categoryName: 'Smart Home',
      assemblerId: '9',
      averageRating: 4.8,
      reviewCount: 14
    },
    {
      id: '21',
      name: 'Security System Installation',
      description: 'Home security system installation including cameras, alarms, smart locks, and monitoring systems.',
      imageUrl: '/assets/services/security.jpg',
      price: 35,
      categoryId: '9',
      categoryName: 'Smart Home',
      assemblerId: '10',
      averageRating: 4.9,
      reviewCount: 11
    },
    // General Maintenance Services
    {
      id: '11',
      name: 'Furniture Assembly',
      description: 'Professional furniture assembly services for all major brands. Includes delivery, assembly, setup in your home, and disposal of packaging materials.',
      imageUrl: '/assets/services/furniture.jpg',
      price: 15,
      categoryId: '10',
      categoryName: 'General Maintenance',
      assemblerId: '1',
      averageRating: 4.6,
      reviewCount: 41
    },
    {
      id: '22',
      name: 'Handyman Services',
      description: 'General home repair and maintenance services. Door repairs, window fixes, minor plumbing, electrical work, and general maintenance tasks.',
      imageUrl: '/assets/services/handyman.jpg',
      price: 20,
      categoryId: '10',
      categoryName: 'General Maintenance',
      assemblerId: '2',
      averageRating: 4.5,
      reviewCount: 35
    }
  ];

  private bookings: Booking[] = [
    {
      id: '1',
      customerId: '1',
      assemblerId: '1',
      serviceId: '1',
      date: new Date('2023-06-15T10:00:00'),
      status: 'completed',
      notes: 'Customer wanted a high-end gaming PC with RGB lighting.',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-15')
    },
    {
      id: '2',
      customerId: '1',
      assemblerId: '3',
      serviceId: '3',
      date: new Date('2023-07-20T14:00:00'),
      status: 'confirmed',
      notes: 'Laptop screen replacement and keyboard cleaning.',
      createdAt: new Date('2023-07-10'),
      updatedAt: new Date('2023-07-15')
    }
  ];

  private categories: Category[] = [
    {
      id: '1',
      name: 'Plumbing & Water',
      description: 'Pipe installation, leak repairs, water heater services',
      image: '/assets/categories/plumbing.jpg'
    },
    {
      id: '2',
      name: 'Electrical Work',
      description: 'Wiring, outlets, lighting, electrical panel upgrades',
      image: '/assets/categories/electrical.jpg'
    },
    {
      id: '3',
      name: 'Painting & Decorating',
      description: 'Interior and exterior painting, wallpapering',
      image: '/assets/categories/painting.jpg'
    },
    {
      id: '4',
      name: 'Carpentry & Woodwork',
      description: 'Custom furniture, cabinet installation, wood repairs',
      image: '/assets/categories/carpentry.jpg'
    },
    {
      id: '5',
      name: 'Flooring & Tiling',
      description: 'Tile installation, flooring, grouting, sealing',
      image: '/assets/categories/flooring.jpg'
    },
    {
      id: '6',
      name: 'HVAC & Climate',
      description: 'Heating, ventilation, air conditioning, ductwork',
      image: '/assets/categories/hvac.jpg'
    },
    {
      id: '7',
      name: 'Roofing & Gutters',
      description: 'Roof repairs, gutter installation, weatherproofing',
      image: '/assets/categories/roofing.jpg'
    },
    {
      id: '8',
      name: 'Kitchen & Bathroom',
      description: 'Kitchen remodeling, bathroom renovation, fixtures',
      image: '/assets/categories/kitchen.jpg'
    },
    {
      id: '9',
      name: 'Smart Home',
      description: 'Smart device installation, home automation',
      image: '/assets/categories/smart-home.jpg'
    },
    {
      id: '10',
      name: 'General Maintenance',
      description: 'General home repairs, maintenance, handyman services',
      image: '/assets/categories/maintenance.jpg'
    }
  ];

  private reviews: Review[] = [
    {
      id: '1',
      customerId: '1',
      assemblerId: '1',
      bookingId: '1',
      rating: 5,
      comment: 'Excellent service! My gaming PC runs perfectly.',
      createdAt: new Date('2023-06-16'),
      updatedAt: new Date('2023-06-16')
    },
    {
      id: '2',
      customerId: '1',
      assemblerId: '3',
      bookingId: '2',
      rating: 4,
      comment: 'Quick and professional service. Laptop works like new.',
      createdAt: new Date('2023-07-21'),
      updatedAt: new Date('2023-07-21')
    }
  ];

  // User methods
  getUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: (this.users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(300));
  }

  // Assembler methods
  getAssemblers(): Assembler[] {
    return [...this.assemblers];
  }

  getAssemblerById(id: string): Assembler | undefined {
    return this.assemblers.find(assembler => assembler.id === id);
  }

  createAssembler(assemblerData: Omit<Assembler, 'id' | 'createdAt' | 'updatedAt'>): Observable<Assembler> {
    const newAssembler: Assembler = {
      ...assemblerData,
      id: (this.assemblers.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.assemblers.push(newAssembler);
    return of(newAssembler).pipe(delay(300));
  }

  // Service methods
  getServices(): Service[] {
    return [...this.services];
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(service => service.id === id);
  }

  // Booking methods
  getBookings(): Booking[] {
    return [...this.bookings];
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(booking => booking.id === id);
  }

  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Observable<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: (this.bookings.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.bookings.push(newBooking);
    return of(newBooking).pipe(delay(300));
  }

  // Category methods
  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  // Review methods
  getReviews(): Review[] {
    return [...this.reviews];
  }

  getReviewsByAssembler(assemblerId: string): Review[] {
    return this.reviews.filter(review => review.assemblerId === assemblerId);
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Observable<Review> {
    const newReview: Review = {
      ...reviewData,
      id: (this.reviews.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.reviews.push(newReview);
    
    // Update assembler average rating
    this.recalcAverageRating(reviewData.assemblerId);
    
    return of(newReview).pipe(delay(300));
  }

  // Helper methods
  getAssemblersByService(serviceId: string): Assembler[] {
    // In a real app, this would be based on service-assembler relationships
    // For mock data, we'll return all assemblers
    return [...this.assemblers];
  }

  recalcAverageRating(assemblerId: string): void {
    const assembler = this.getAssemblerById(assemblerId);
    if (!assembler) return;

    const reviews = this.getReviewsByAssembler(assemblerId);
    if (reviews.length === 0) {
      assembler.averageRating = 0;
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    assembler.averageRating = Number((totalRating / reviews.length).toFixed(1));
    // Note: reviewCount is not part of Assembler model, so we don't set it
  }
}