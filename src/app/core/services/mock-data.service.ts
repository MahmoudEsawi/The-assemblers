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
      name: 'Jane Smith',
      email: 'assembler@example.com',
      password: 'password',
      phone: '987-654-3210',
      address: '456 Oak St, Town',
      role: 'assembler',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      specialization: 'PC Assembly & Repair',
      description: 'Experienced technician with 10+ years in computer assembly and repair. Specializes in custom gaming PCs and data recovery.',
      averageRating: 4.8,
      profileImage: '/assets/assemblers/assembler1.jpg',
      coverImage: '/assets/assemblers/assembler1-cover.jpg',
      location: 'New York, NY',
      isVerified: true
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'password',
      phone: '555-123-4567',
      address: '789 Pine St, Village',
      role: 'assembler',
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-02-10'),
      specialization: 'Networking & Security',
      description: 'Network specialist with expertise in home and office networking, security systems, and IT infrastructure.',
      averageRating: 4.6,
      profileImage: '/assets/assemblers/assembler2.jpg',
      coverImage: '/assets/assemblers/assembler2-cover.jpg',
      location: 'Los Angeles, CA',
      isVerified: true
    },
    {
      id: '3',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      password: 'password',
      phone: '555-987-6543',
      address: '321 Elm St, Borough',
      role: 'assembler',
      createdAt: new Date('2023-03-05'),
      updatedAt: new Date('2023-03-05'),
      specialization: 'Laptop Repair & Upgrades',
      description: 'Specialist in laptop repair, upgrades, and maintenance. Quick turnaround and competitive prices.',
      averageRating: 4.5,
      profileImage: '/assets/assemblers/assembler3.jpg',
      coverImage: '/assets/assemblers/assembler3-cover.jpg',
      location: 'Chicago, IL',
      isVerified: true
    }
  ];

  private services: Service[] = [
    {
      id: '1',
      name: 'Custom PC Assembly',
      description: 'Professional assembly of custom-built computers tailored to your specific needs and budget.',
      imageUrl: '/assets/services/custom-pc.jpg',
      price: 99,
      categoryId: '1',
      categoryName: 'PC Assembly',
      assemblerId: '1',
      averageRating: 4.8,
      reviewCount: 24
    },
    {
      id: '2',
      name: 'Gaming PC Setup',
      description: 'Complete setup of high-performance gaming PCs with optimized cooling and RGB lighting.',
      imageUrl: '/assets/services/gaming-pc.jpg',
      price: 149,
      categoryId: '1',
      categoryName: 'PC Assembly',
      assemblerId: '2',
      averageRating: 4.7,
      reviewCount: 18
    },
    {
      id: '3',
      name: 'Laptop Repair',
      description: 'Expert diagnosis and repair for all laptop brands and models, including screen and keyboard replacements.',
      imageUrl: '/assets/services/laptop-repair.jpg',
      price: 79,
      categoryId: '2',
      categoryName: 'Repair',
      assemblerId: '3',
      averageRating: 4.5,
      reviewCount: 32
    },
    {
      id: '4',
      name: 'Data Recovery',
      description: 'Professional data recovery services from damaged hard drives, SSDs, and other storage devices.',
      imageUrl: '/assets/services/data-recovery.jpg',
      price: 129,
      categoryId: '3',
      categoryName: 'Data Services',
      assemblerId: '1',
      averageRating: 4.9,
      reviewCount: 15
    },
    {
      id: '5',
      name: 'Network Setup',
      description: 'Home and office network installation, including routers, switches, and Wi-Fi optimization.',
      imageUrl: '/assets/services/network-setup.jpg',
      price: 89,
      categoryId: '4',
      categoryName: 'Networking',
      assemblerId: '2',
      averageRating: 4.6,
      reviewCount: 21
    },
    {
      id: '6',
      name: 'Virus Removal',
      description: 'Thorough virus and malware removal with system optimization and security recommendations.',
      imageUrl: '/assets/services/virus-removal.jpg',
      price: 69,
      categoryId: '2',
      categoryName: 'Repair',
      assemblerId: '1',
      averageRating: 4.4,
      reviewCount: 27
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
      name: 'PC Assembly',
      description: 'Custom PC building and assembly services',
      image: '/assets/categories/pc-assembly.jpg'
    },
    {
      id: '2',
      name: 'Repair',
      description: 'Repair services for computers and laptops',
      image: '/assets/categories/repair.jpg'
    },
    {
      id: '3',
      name: 'Data Services',
      description: 'Data recovery and backup services',
      image: '/assets/categories/data-services.jpg'
    },
    {
      id: '4',
      name: 'Networking',
      description: 'Network setup and configuration services',
      image: '/assets/categories/networking.jpg'
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
  }
}