import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionPlan } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers() {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'plan', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPayments() {
    // Mock payment data for demo
    return [
      {
        id: '1',
        userEmail: 'user@example.com',
        amount: 29,
        status: 'paid',
        created: new Date(),
      },
    ];
  }

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    const freeUsers = await this.usersRepository.count({
      where: { plan: SubscriptionPlan.FREE },
    });
    const proUsers = await this.usersRepository.count({
      where: { plan: SubscriptionPlan.PRO },
    });
    const enterpriseUsers = await this.usersRepository.count({
      where: { plan: SubscriptionPlan.ENTERPRISE },
    });

    return {
      totalUsers,
      activeSubscriptions: proUsers + enterpriseUsers,
      mrr: proUsers * 29 + enterpriseUsers * 99,
      totalRevenue: (proUsers * 29 + enterpriseUsers * 99) * 12,
      freePlanUsers: freeUsers,
      proPlanUsers: proUsers,
      enterprisePlanUsers: enterpriseUsers,
    };
  }
}

