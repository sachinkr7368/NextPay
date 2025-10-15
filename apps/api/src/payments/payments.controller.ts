import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Headers,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  createCheckoutSession(
    @Request() req: any,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    return this.paymentsService.createCheckoutSession(
      req.user.id,
      createCheckoutDto.priceId,
    );
  }

  @Post('create-portal-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe billing portal session' })
  createPortalSession(@Request() req: any) {
    return this.paymentsService.createPortalSession(req.user.id);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscription details' })
  getSubscription(@Request() req: any) {
    return this.paymentsService.getSubscription(req.user.id);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user invoices' })
  getInvoices(@Request() req: any) {
    return this.paymentsService.getInvoices(req.user.id);
  }

  @Post('sync-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually sync subscription status from Stripe' })
  syncSubscription(@Request() req: any) {
    return this.paymentsService.syncSubscription(req.user.id);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available pricing plans' })
  getPricingPlans() {
    return this.paymentsService.getPricingPlans();
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<ExpressRequest>,
  ) {
    console.log('Webhook received:', {
      hasSignature: !!signature,
      hasRawBody: !!req.rawBody,
      rawBodyType: typeof req.rawBody,
      rawBodyLength: req.rawBody ? req.rawBody.length : 0,
      hasParsedBody: !!req.body,
      parsedBodyType: typeof req.body,
    });
    
    // Railway-specific handling: use parsed body when raw body is not available
    if (!req.rawBody && req.body) {
      console.log('Railway mode: Using parsed body, skipping signature verification');
      return this.paymentsService.handleWebhookRailway(req.body);
    }
    
    return this.paymentsService.handleWebhook(signature, req.rawBody || Buffer.from(''));
  }

  @Get('debug/config')
  @ApiOperation({ summary: 'Debug Stripe configuration' })
  async debugConfig() {
    return this.paymentsService.debugConfig();
  }

  @Get('debug/webhook-test')
  @ApiOperation({ summary: 'Test webhook endpoint' })
  async testWebhook() {
    return { 
      message: 'Webhook endpoint is working',
      timestamp: new Date().toISOString(),
      version: '2.0'
    };
  }

  @Post('cancel-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel user subscription' })
  async cancelSubscription(@Request() req: any) {
    return this.paymentsService.cancelSubscription(req.user.id);
  }
}

