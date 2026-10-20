import React, { useState } from 'react';
import type { CartItem, Order } from '../types';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ThermometerSnowflake, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, tier: 'retail' | 'wholesale') => void;
  onRemoveItem: (productId: string, tier: 'retail' | 'wholesale') => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [tipPercentage, setTipPercentage] = useState<number>(5);
  const [deliveryMethod, setDeliveryMethod] = useState<'cold_chain_express' | 'hub_pickup' | 'farm_gate'>('cold_chain_express');
  const [deliverySlot, setDeliverySlot] = useState<string>('Tomorrow 06:00 - 10:00 AM (Early Chilled)');
  const [isCheckoutStep, setIsCheckoutStep] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState<string>('Chef Julian Reynolds');
  const [customerEmail, setCustomerEmail] = useState<string>('julian@heirloomtable.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+1 (555) 234-5678');
  const [shippingAddress, setShippingAddress] = useState<string>('442 Orchard Way, Suite B, Portland, OR 97201');
  const [buyerType, setBuyerType] = useState<'consumer' | 'restaurant' | 'grocery' | 'wholesale_distributor'>('restaurant');

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.tier === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice;
    return acc + (price * item.quantity);
  }, 0);

  const deliveryFee = deliveryMethod === 'cold_chain_express' 
    ? (subtotal > 75 ? 0 : 8.50)
    : (deliveryMethod === 'hub_pickup' ? 3.00 : 0);

  const tipAmount = (subtotal * tipPercentage) / 100;
  const total = subtotal + deliveryFee + tipAmount;

  // 88.6% direct farmer revenue
  const farmerDirectPayout = subtotal * 0.886;
  const platformFee = subtotal * 0.114;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: `AGRI-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      customerName,
      customerEmail,
      customerPhone,
      buyerType,
      shippingAddress,
      deliverySlot,
      deliveryMethod,
      tipPercentage,
      subtotal,
      deliveryFee,
      tipAmount,
      farmerDirectPayout,
      platformFee,
      total,
      status: 'confirmed',
      timeline: [
        { status: 'confirmed', label: 'Order Confirmed in Farm Escrow', time: 'Just now', location: 'AgriFlow Clearinghouse', completed: true },
        { status: 'harvest_assigned', label: 'Field Sorting & Batch Validation', time: 'Today 18:00 PM', location: 'Farm Packhouses', completed: true },
        { status: 'cold_transport', label: 'Cold-Chain Refrigerated Transit (2°C)', time: 'Tomorrow 04:30 AM', location: 'Pacific Agro-Hub', completed: false },
        { status: 'delivered', label: 'Delivered Fresh to Doorstep / Kitchen', time: deliverySlot, location: shippingAddress, completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    onOrderPlaced(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    setIsCheckoutStep(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '520px', 
          height: '100vh', 
          maxHeight: '100vh', 
          borderRadius: 0,
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={20} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {confirmedOrder ? 'Order Confirmed!' : isCheckoutStep ? 'Secure Agribusiness Checkout' : 'Harvest Basket'}
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {confirmedOrder ? (
          <div style={{ padding: '32px 24px', overflowY: 'auto', flex: 1, textAlign: 'center' }}>
            <div style={{ 
              width: '68px', 
              height: '68px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-100)', 
              color: 'var(--primary-700)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 16px rgba(34, 160, 102, 0.25)'
            }}>
              <CheckCircle2 size={38} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-950)', marginBottom: '6px' }}>
              Harvest Contract Placed!
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Order ID: <strong>#{confirmedOrder.id}</strong> • Confirmation sent to {confirmedOrder.customerEmail}
            </p>

            {/* Direct Impact Box */}
            <div style={{ 
              backgroundColor: 'var(--primary-50)', 
              border: '1.5px solid var(--primary-200)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '16px', 
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Heart size={16} color="var(--primary-700)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Your Direct Agricultural Impact:
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--primary-800)', margin: 0, lineHeight: 1.5 }}>
                <strong>${confirmedOrder.farmerDirectPayout.toFixed(2)}</strong> (88.6% of produce total) has been credited directly into the escrow accounts of your partner farmers. Zero broker deduction.
              </p>
            </div>

            {/* Live Cold-Chain Tracking Timeline */}
            <div style={{ textAlign: 'left', marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThermometerSnowflake size={16} color="#0284c7" />
                Live Cold-Chain Dispatch Timeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
                {confirmedOrder.timeline.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ 
                      width: '22px', 
                      height: '22px', 
                      borderRadius: '50%', 
                      backgroundColor: step.completed ? 'var(--primary-600)' : 'var(--bg-subtle)', 
                      color: step.completed ? '#ffffff' : 'var(--text-faint)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px',
                      border: `2px solid ${step.completed ? 'var(--primary-600)' : 'var(--border-color)'}`
                    }}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: step.completed ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                        {step.time} • {step.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleReset}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Continue Exploring Fresh Harvests
            </button>
          </div>
        ) : isCheckoutStep ? (
          
          /* CHECKOUT FORM STEP */
          <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '24px', flex: 1 }}>
              
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Buyer Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setBuyerType('restaurant')}
                    style={{
                      padding: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${buyerType === 'restaurant' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                      backgroundColor: buyerType === 'restaurant' ? 'var(--primary-50)' : '#ffffff',
                      color: buyerType === 'restaurant' ? 'var(--primary-900)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Culinary / Restaurant
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuyerType('consumer')}
                    style={{
                      padding: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${buyerType === 'consumer' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                      backgroundColor: buyerType === 'consumer' ? 'var(--primary-50)' : '#ffffff',
                      color: buyerType === 'consumer' ? 'var(--primary-900)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Household / Consumer
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Contact Name / Business *</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={customerEmail} 
                      onChange={(e) => setCustomerEmail(e.target.value)} 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone *</label>
                    <input 
                      type="tel" 
                      required 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Delivery Address *</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingAddress} 
                    onChange={(e) => setShippingAddress(e.target.value)} 
                    className="form-input" 
                  />
                </div>

                <div>
                  <label className="form-label">Cold-Chain Delivery Window *</label>
                  <select 
                    value={deliverySlot} 
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="form-input"
                  >
                    <option value="Tomorrow 06:00 - 10:00 AM (Early Chilled)">Tomorrow 06:00 - 10:00 AM (Early Chilled)</option>
                    <option value="Tomorrow 14:00 - 18:00 PM (Afternoon Fresh)">Tomorrow 14:00 - 18:00 PM (Afternoon Fresh)</option>
                    <option value="Friday Morning Regular Delivery">Friday Morning Regular Delivery</option>
                  </select>
                </div>
              </div>

              {/* Order summary recap */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Produce Subtotal ({cart.length} items):</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Cold-Chain Express Delivery:</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Farm Worker Tip ({tipPercentage}%):</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--primary-900)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setIsCheckoutStep(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Back to Cart
              </button>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                Confirm & Place Order
              </button>
            </div>
          </form>

        ) : (

          /* CART ITEMS LIST */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <ShoppingCart size={48} color="var(--border-color)" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Your Harvest Basket is Empty</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Explore today's morning harvest batches straight from verified regenerative family farms.</p>
                <button onClick={onClose} className="btn btn-primary">
                  Explore Fresh Produce
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cart.map((item) => {
                      const itemPrice = item.tier === 'wholesale' 
                        ? item.product.wholesalePrice 
                        : item.product.retailPrice;
                      const unit = item.tier === 'wholesale' 
                        ? item.product.wholesaleUnit 
                        : item.product.retailUnit;

                      return (
                        <div 
                          key={`${item.product.id}-${item.tier}`}
                          style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            padding: '12px', 
                            borderRadius: 'var(--radius-lg)', 
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                          />

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                                  {item.product.name}
                                </h4>
                                <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                                  {item.product.farmName} • ${itemPrice.toFixed(2)} / {unit}
                                </div>
                              </div>

                              <button 
                                onClick={() => onRemoveItem(item.product.id, item.tier)}
                                style={{ color: 'var(--text-faint)', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                              <span className={item.tier === 'wholesale' ? 'badge badge-wholesale' : 'badge badge-organic'} style={{ fontSize: '0.68rem' }}>
                                {item.tier === 'wholesale' ? 'Wholesale Bulk Tier' : 'Direct Retail'}
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                                  <button 
                                    onClick={() => onUpdateQuantity(item.product.id, Math.max(item.tier === 'wholesale' ? item.product.wholesaleMinOrder : 1, item.quantity - (item.tier === 'wholesale' ? 5 : 1)), item.tier)}
                                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                  >
                                    -
                                  </button>
                                  <span style={{ padding: '0 6px', fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity}</span>
                                  <button 
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + (item.tier === 'wholesale' ? 5 : 1), item.tier)}
                                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                                  >
                                    +
                                  </button>
                                </div>

                                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-900)' }}>
                                  ${(itemPrice * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Selection */}
                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={14} />
                      <span>Fulfillment & Cold-Chain Method</span>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        border: `1.5px solid ${deliveryMethod === 'cold_chain_express' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: deliveryMethod === 'cold_chain_express' ? 'var(--primary-50)' : '#ffffff',
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="radio" 
                            name="delivery" 
                            checked={deliveryMethod === 'cold_chain_express'} 
                            onChange={() => setDeliveryMethod('cold_chain_express')} 
                          />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Chilled Cold-Chain Express (2°C)</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Delivered within 24 hours of morning harvest</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{subtotal > 75 ? 'FREE' : '$8.50'}</span>
                      </label>

                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        border: `1.5px solid ${deliveryMethod === 'hub_pickup' ? 'var(--primary-600)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: deliveryMethod === 'hub_pickup' ? 'var(--primary-50)' : '#ffffff',
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="radio" 
                            name="delivery" 
                            checked={deliveryMethod === 'hub_pickup'} 
                            onChange={() => setDeliveryMethod('hub_pickup')} 
                          />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Regional Agro-Hub Locker Pickup</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Collect anytime from temperature-controlled locker</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>$3.00</span>
                      </label>
                    </div>
                  </div>

                  {/* Tip the Farm Worker Fund */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Heart size={13} color="#ea580c" />
                        <span>Support The Harvest Worker Fund</span>
                      </label>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--earth-600)' }}>100% to field hands</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {[0, 5, 10, 15].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setTipPercentage(pct)}
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${tipPercentage === pct ? 'var(--earth-500)' : 'var(--border-color)'}`,
                            backgroundColor: tipPercentage === pct ? 'var(--earth-100)' : '#ffffff',
                            color: tipPercentage === pct ? 'var(--earth-800)' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          {pct === 0 ? 'None' : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Totals & Checkout Button */}
                <div style={{ 
                  padding: '20px 24px', 
                  borderTop: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-subtle)' 
                }}>
                  {/* Farmer direct revenue guarantee */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    backgroundColor: 'var(--primary-100)', 
                    color: 'var(--primary-800)', 
                    padding: '8px 12px', 
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    marginBottom: '12px'
                  }}>
                    <ShieldCheck size={16} />
                    <span><strong>${farmerDirectPayout.toFixed(2)}</strong> goes directly to your partner farms.</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Total</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-950)', fontFamily: 'var(--font-heading)' }}>
                        ${total.toFixed(2)}
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsCheckoutStep(true)}
                      className="btn btn-primary btn-lg"
                      style={{ padding: '12px 28px' }}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
