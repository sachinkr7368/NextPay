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
      bodyType: typeof req.body,
      rawBodyType: typeof req.rawBody,
      bodyLength: req.body ? JSON.stringify(req.body).length : 0,
      rawBodyLength: req.rawBody ? req.rawBody.length : 0,
      signatureHeader: signature,
    });
    
    // Try to get raw body, fallback to stringified body if raw body not available
    let payload: Buffer;
    if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
      payload = req.rawBody;
      console.log('Using raw body:', payload.length, 'bytes');
    } else if (req.body) {
      // Fallback: reconstruct raw body from parsed JSON
      payload = Buffer.from(JSON.stringify(req.body));
      console.log('Using reconstructed body from JSON:', payload.length, 'bytes');
    } else {
      payload = Buffer.from('');
      console.log('No body available');
    }
    
    return this.paymentsService.handleWebhook(signature, payload);
  }

  @Get('debug/config')
  @ApiOperation({ summary: 'Debug Stripe configuration' })
  async debugConfig() {
    return this.paymentsService.debugConfig();
  }
}

