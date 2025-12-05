// Helper to create timestamps relative to now
const hoursAgo = (hours) => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

// Helper for order dates
const formatOrderDate = (daysOffset) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString()
}

export const initialCases = [
  // Case 1: Return policy inquiry - Business Buyer
  {
    id: 'case_001',
    orderId: '111-1537220-5238650',
    buyerName: 'Sakina',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Return/Refund/Replace',
    status: 'needs_response',
    dueHours: 7,
    lastMessageAt: hoursAgo(2),
    subject: 'Return policy inquiry from Amazon customer Sakina(Order: 111-1537220-523865...',
    product: {
      name: 'Rust-Oleum V2155838 High Performance V2100 System Rust Preventive...',
      image: 'https://m.media-amazon.com/images/I/71RcWEjHXrL._AC_SX425_.jpg',
      asin: 'B00LVRDWGA',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Aug 27, 2025 3:48 PM EST',
      shipBy: 'Aug 29, 2025 2:59 AM EST',
      deliverBy: 'Sep 6, 2025 2:59 AM EST',
    },
    messages: [
      {
        id: 'msg_001',
        role: 'buyer',
        content: `we ordered extra spray cans. Can we please place an order for a return?`,
        timestamp: hoursAgo(2),
      },
    ],
  },

  // Case 2: Package didn't arrive
  {
    id: 'case_002',
    orderId: '113-4156634-0934633',
    buyerName: 'DAVID',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Return/Refund/Replace',
    status: 'needs_response',
    dueHours: 8,
    lastMessageAt: hoursAgo(5),
    subject: "Package didn't arrive: Request a refund(Order: 113-4156634-0934633)",
    product: {
      name: 'Industrial Strength Adhesive Spray 16oz',
      image: 'https://m.media-amazon.com/images/I/71xL5RqPpBL._AC_SX425_.jpg',
      asin: 'B00M3WNYXE',
      quantity: 2,
    },
    order: {
      purchaseDate: 'Oct 15, 2025 10:22 AM EST',
      shipBy: 'Oct 17, 2025 5:00 PM EST',
      deliverBy: 'Oct 24, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_002a',
        role: 'buyer',
        content: `My order says it was delivered yesterday but I never got it. I was home all day and nothing came. Can you check on this?`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_002b',
        role: 'seller',
        content: `Hi DAVID, I'm sorry to hear that! Sometimes carriers mark packages as delivered a bit early. Could you check around your front door, back porch, or with any neighbors? Also, if you live in an apartment, it might be in a package locker or with your building manager. Let me know if it turns up!`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_002c',
        role: 'buyer',
        content: `Checked everywhere - asked my neighbors, checked the mailroom, nothing. It's been 2 days now since it supposedly delivered. This is really frustrating.`,
        timestamp: hoursAgo(5),
      },
    ],
  },

  // Case 3: Order inquiry
  {
    id: 'case_003',
    orderId: '112-2345678-9012345',
    buyerName: 'Dean',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Order Inquiry',
    status: 'needs_response',
    dueHours: 8,
    lastMessageAt: hoursAgo(1),
    subject: 'Order inquiry from Amazon customer Dean',
    product: {
      name: 'Bluetooth Speaker Portable 20W',
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SX425_.jpg',
      asin: 'B08N5WRWNW',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 20, 2025 2:15 PM EST',
      shipBy: 'Oct 22, 2025 11:59 PM EST',
      deliverBy: 'Oct 29, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_003',
        role: 'buyer',
        content: `URGENT!!! I ordered a BLACK speaker and you sent me a BLUE one. I have a party THIS WEEKEND and I specifically needed black to match my setup. This is unacceptable!! I need this fixed IMMEDIATELY or I'm leaving a 1-star review. How hard is it to get colors right???`,
        timestamp: hoursAgo(1),
      },
    ],
  },

  // Case 4: Return policy inquiry - Business Buyer
  {
    id: 'case_004',
    orderId: '111-7978093-5848265',
    buyerName: 'Ferran',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Return/Refund/Replace',
    status: 'needs_response',
    dueHours: 8,
    lastMessageAt: hoursAgo(8),
    subject: 'Return policy inquiry from Amazon customer Ferran(Order: 111-7978093-584826...',
    product: {
      name: 'iPhone 15 Pro Max Clear Case',
      image: 'https://m.media-amazon.com/images/I/61IBBVJvSDL._AC_SX425_.jpg',
      asin: 'B0CHX3QBCH',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 18, 2025 9:30 AM EST',
      shipBy: 'Oct 20, 2025 5:00 PM EST',
      deliverBy: 'Oct 27, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_004',
        role: 'buyer',
        content: `Quick question - does this case support MagSafe? I couldn't find it in the description. Thanks!`,
        timestamp: hoursAgo(8),
      },
    ],
  },

  // Case 5: Return request - polite
  {
    id: 'case_005',
    orderId: '112-0123456-7890123',
    buyerName: 'Robert Johnson',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Return/Refund/Replace',
    status: 'needs_response',
    dueHours: 12,
    lastMessageAt: hoursAgo(12),
    subject: 'Return request from Amazon customer Robert Johnson',
    product: {
      name: 'Laptop Stand Adjustable Aluminum',
      image: 'https://m.media-amazon.com/images/I/71Hk8VS2msL._AC_SX425_.jpg',
      asin: 'B08CKXWLBT',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 10, 2025 4:45 PM EST',
      shipBy: 'Oct 12, 2025 11:59 PM EST',
      deliverBy: 'Oct 19, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_005',
        role: 'buyer',
        content: `Hello, I received the laptop stand and it's nice quality, but it's a bit taller than I expected and doesn't work well with my desk setup. Would it be possible to return this for a refund? I've kept all the packaging. Thank you for your help.`,
        timestamp: hoursAgo(12),
      },
    ],
  },

  // Case 6: Already resolved - has seller response
  {
    id: 'case_006',
    orderId: '112-4567890-1234000',
    buyerName: 'Emily Brown',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Product Issue',
    status: 'responded',
    dueHours: null,
    lastMessageAt: daysAgo(1),
    subject: 'Scroll wheel issue - Wireless Mouse Ergonomic',
    product: {
      name: 'Wireless Mouse Ergonomic',
      image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SX425_.jpg',
      asin: 'B08HR71TJV',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 5, 2025 11:20 AM EST',
      shipBy: 'Oct 7, 2025 5:00 PM EST',
      deliverBy: 'Oct 14, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_006a',
        role: 'buyer',
        content: `The scroll wheel on my mouse stopped working after just a week of use. Pretty disappointed since it wasn't cheap.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_006b',
        role: 'seller',
        content: `I'm sorry to hear that - a week is way too soon for any issues. I'm shipping out a replacement today, and it should arrive by Thursday. No need to return the defective one; just recycle it or toss it. Sorry for the hassle, and thanks for letting us know!`,
        timestamp: daysAgo(1),
      },
    ],
  },

  // Case 7: Defective product - tech troubleshooting
  {
    id: 'case_007',
    orderId: '112-5555555-9999999',
    buyerName: 'Michael Park',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Product Issue',
    status: 'needs_response',
    dueHours: 3,
    lastMessageAt: hoursAgo(3),
    subject: 'ANC not working - Noise Cancelling Headphones ANC-500',
    product: {
      name: 'Noise Cancelling Headphones ANC-500',
      image: 'https://m.media-amazon.com/images/I/61eDXs9QFNL._AC_SX425_.jpg',
      asin: 'B09XL1F9C7',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 22, 2025 1:30 PM EST',
      shipBy: 'Oct 24, 2025 5:00 PM EST',
      deliverBy: 'Oct 31, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_007a',
        role: 'buyer',
        content: `The ANC on my headphones isn't working properly. When I turn it on there's a weird buzzing sound and it doesn't seem to block any noise at all.`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_007b',
        role: 'seller',
        content: `That doesn't sound right at all. Can you try resetting the headphones? Press and hold the power button for 15 seconds until you see the LED flash red three times. Then try pairing again. This often fixes ANC calibration issues.`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_007c',
        role: 'buyer',
        content: `Tried the reset, still buzzing. Same issue. I've only had these for 3 days so they should definitely work properly.`,
        timestamp: hoursAgo(3),
      },
    ],
  },

  // Case 8: Order status inquiry
  {
    id: 'case_008',
    orderId: '112-7777777-1111111',
    buyerName: 'Amanda Foster',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Shipping Inquiry',
    status: 'needs_response',
    dueHours: 6,
    lastMessageAt: hoursAgo(6),
    subject: 'Tracking update request - Smart Watch Fitness Tracker',
    product: {
      name: 'Smart Watch Fitness Tracker',
      image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SX425_.jpg',
      asin: 'B0BDHW1T8M',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 23, 2025 8:15 AM EST',
      shipBy: 'Oct 25, 2025 11:59 PM EST',
      deliverBy: 'Nov 1, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_008',
        role: 'buyer',
        content: `Hi! I ordered this as a birthday gift and I'm wondering when it will arrive? The tracking hasn't updated in 2 days and I'm getting a bit worried since the birthday is on Saturday. Any update would be great, thx!`,
        timestamp: hoursAgo(6),
      },
    ],
  },

  // Case 9: Quantity issue
  {
    id: 'case_009',
    orderId: '112-8888888-2222222',
    buyerName: 'James Wilson',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Order Issue',
    status: 'needs_response',
    dueHours: 24,
    lastMessageAt: daysAgo(3),
    subject: 'Missing item in package - Screen Protector 3-Pack',
    product: {
      name: 'Screen Protector Tempered Glass (3-Pack)',
      image: 'https://m.media-amazon.com/images/I/71V7Q4QLuWL._AC_SX425_.jpg',
      asin: 'B09SBHG7X4',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 12, 2025 3:40 PM EST',
      shipBy: 'Oct 14, 2025 5:00 PM EST',
      deliverBy: 'Oct 21, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_009',
        role: 'buyer',
        content: `I bought the 3-pack but only got 2 screen protectors in the box. Kinda annoying since I paid for 3. Can I get the missing one sent?`,
        timestamp: daysAgo(3),
      },
    ],
  },

  // Case 10: Compatibility question after purchase
  {
    id: 'case_010',
    orderId: '112-9999999-3333333',
    buyerName: 'Lisa Nakamura',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Product Question',
    status: 'needs_response',
    dueHours: 48,
    lastMessageAt: daysAgo(5),
    subject: 'Compatibility question - Portable Charger 20000mAh',
    product: {
      name: 'Portable Charger 20000mAh',
      image: 'https://m.media-amazon.com/images/I/71JB6hM6Z4L._AC_SX425_.jpg',
      asin: 'B0B5MQ1PZZ',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Oct 8, 2025 6:50 PM EST',
      shipBy: 'Oct 10, 2025 11:59 PM EST',
      deliverBy: 'Oct 17, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_010',
        role: 'buyer',
        content: `Just got my power bank, it works great for my iPhone but I'm having trouble charging my Nintendo Switch with it. Is it supposed to work with the Switch? The listing said it works with gaming devices but it's only charging super slowly if at all.`,
        timestamp: daysAgo(5),
      },
    ],
  },

  // Case 11: Long printer troubleshooting thread
  {
    id: 'case_011',
    orderId: '112-3456789-0123456',
    buyerName: 'Carlos Mendez',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Product Issue',
    status: 'needs_response',
    dueHours: 4,
    lastMessageAt: hoursAgo(4),
    subject: 'Wireless printer connection issues - LaserJet Pro M404',
    product: {
      name: 'LaserJet Pro M404 Wireless Printer',
      image: 'https://m.media-amazon.com/images/I/61fTU5k-yzL._AC_SX425_.jpg',
      asin: 'B07XQRB3R4',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Nov 15, 2025 2:30 PM EST',
      shipBy: 'Nov 17, 2025 5:00 PM EST',
      deliverBy: 'Nov 24, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_011a',
        role: 'buyer',
        content: `Hi, I just set up my new printer but it won't connect to my WiFi network. I've tried the WPS button method and manual setup but neither works. The printer keeps saying "Connection Failed."`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_011b',
        role: 'seller',
        content: `Hi Carlos! Sorry you're having trouble with the WiFi setup. A few quick things to check:
1. Make sure your printer is within range of your router (try moving it closer temporarily)
2. Ensure your network is 2.4GHz - this printer doesn't support 5GHz networks
3. Check that your WiFi password doesn't have any special characters that might cause issues

Can you also tell me what router you're using? That might help me troubleshoot further.`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_011c',
        role: 'buyer',
        content: `Thanks for the quick response! I moved the printer right next to the router - still no luck. I have a Google Nest WiFi router. I checked and my network name doesn't have special characters. Not sure about the 2.4 vs 5GHz thing - how do I check that?`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_011d',
        role: 'seller',
        content: `Google Nest routers can be tricky because they automatically combine 2.4GHz and 5GHz into one network name. The printer might be trying to connect to the 5GHz band and failing.

Here's what to try:
1. Open the Google Home app
2. Go to WiFi settings → Networking
3. Look for "Preferred activities" and temporarily prioritize 2.4GHz

Alternatively, you could try setting up the printer using a USB cable first (just to get it on the network), then disconnect the cable. Sometimes that method is more reliable.

Let me know how it goes!`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_011e',
        role: 'buyer',
        content: `OK I don't see that exact option in Google Home but I tried the USB setup method. The printer shows as connected in the printer settings and even shows my network name, but when I try to print from my computer it still says "Printer Offline". This is so frustrating - I need this for work!`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_011f',
        role: 'seller',
        content: `I understand the frustration - let's get this working for you!

If the printer shows connected but your computer says offline, it's likely a computer-side issue:
1. On your computer, go to Settings → Printers & Scanners
2. Remove the printer from the list
3. Click "Add a printer" and let it scan for network printers
4. Select your LaserJet when it appears

Also, make sure both your computer and printer are on the same network (sometimes computers connect to a different band or guest network).

If that doesn't work, could you tell me:
- What operating system you're using?
- Does the printer have a fixed IP, or is it using DHCP?`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_011g',
        role: 'buyer',
        content: `I'm on Windows 11. I removed and re-added the printer like you said. Now something different - it found the printer but when I try to print it just sits in the queue and nothing happens. I printed a test page from the printer itself and that worked fine, so the printer works. Just won't print from my computer. I don't know about the IP stuff.`,
        timestamp: hoursAgo(4),
      },
    ],
  },

  // Case 12: Escalating complaint that gets resolved
  {
    id: 'case_012',
    orderId: '112-6543210-9876543',
    buyerName: 'Patricia Simmons',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Order Issue',
    status: 'responded',
    dueHours: null,
    lastMessageAt: hoursAgo(8),
    subject: 'DAMAGED ITEM - Ceramic Vase Set',
    product: {
      name: 'Modern Ceramic Vase Set (3 Piece)',
      image: 'https://m.media-amazon.com/images/I/61Kw8UGhTML._AC_SX425_.jpg',
      asin: 'B0CVK8DMNP',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Nov 20, 2025 11:15 AM EST',
      shipBy: 'Nov 22, 2025 5:00 PM EST',
      deliverBy: 'Nov 29, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_012a',
        role: 'buyer',
        content: `Absolutely UNACCEPTABLE. I ordered these vases for my daughter's wedding centerpieces and TWO of the three arrived SHATTERED. The box looked like it was kicked down the street. I am FURIOUS. This wedding is in TWO WEEKS and now I have to scramble to find replacements. I want a FULL refund AND compensation for my time. I'm reporting this to Amazon and the BBB.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_012b',
        role: 'seller',
        content: `Oh no, I am so incredibly sorry to hear this! I can only imagine how stressful this is with your daughter's wedding coming up. This is absolutely not the experience we want for any customer, especially for such an important occasion.

Please don't worry - I want to make this right for you immediately:

1. I'm processing a full refund right now - you should see it in 3-5 business days
2. I'm also sending a brand new set via overnight shipping at NO cost to you - it will arrive tomorrow
3. As an apology for this terrible experience, I'm including a $50 Amazon gift card

Could you please send me a photo of the damaged items? This helps us file a claim with the carrier and improve our packaging. But even if you can't, the refund and replacement are already on their way.

Again, my sincerest apologies. I hope your daughter has the most beautiful wedding!`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_012c',
        role: 'buyer',
        content: `Okay... I wasn't expecting such a quick response. Here are the photos of the damaged vases. The large one is completely destroyed and the medium one has a huge crack.

I appreciate you taking this seriously. The overnight shipping would be amazing if you can actually do that. When will I get a tracking number?`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_012d',
        role: 'seller',
        content: `Thank you for the photos - I've filed the carrier claim. Your replacement is already packed and will ship within the hour. I'll send the tracking number as soon as it's generated (should be within 2-3 hours).

Tracking should show overnight delivery for tomorrow before 5 PM. I've also added signature required so we make sure it gets to you safely.

Please let me know when it arrives and if everything is in perfect condition. Wishing you and your daughter all the best for the big day! 🎊`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_012e',
        role: 'buyer',
        content: `The replacement arrived today and everything is perfect! All three vases are beautiful and exactly what I needed. I really appreciate how quickly you handled this - it went from my worst shopping experience to honestly one of the best customer service experiences I've ever had. 

I'm going to update my review and definitely buying from you again. Thank you so much!`,
        timestamp: hoursAgo(8),
      },
      {
        id: 'msg_012f',
        role: 'seller',
        content: `This made my day! 🎉 I'm so glad everything arrived safely and that you're happy with the vases. Thank you for giving us the chance to make it right.

Congratulations again on your daughter's upcoming wedding - I hope everything goes beautifully! If you ever need anything in the future, don't hesitate to reach out. Best wishes! 💐`,
        timestamp: hoursAgo(8),
      },
    ],
  },

  // Case 13: Warranty claim discussion
  {
    id: 'case_013',
    orderId: '112-1111222-3334444',
    buyerName: 'Thomas Wright',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Warranty Claim',
    status: 'needs_response',
    dueHours: 5,
    lastMessageAt: hoursAgo(5),
    subject: 'Warranty claim - Electric Standing Desk Frame',
    product: {
      name: 'Electric Standing Desk Frame - Dual Motor',
      image: 'https://m.media-amazon.com/images/I/71xqGpDk-hL._AC_SX425_.jpg',
      asin: 'B09JNL3Y7P',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Mar 15, 2025 9:45 AM EST',
      shipBy: 'Mar 17, 2025 5:00 PM EST',
      deliverBy: 'Mar 24, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_013a',
        role: 'buyer',
        content: `Hi, I purchased this standing desk frame about 8 months ago and one of the motors has stopped working. The desk only raises on one side now, which makes it unusable. I believe this should be covered under warranty?`,
        timestamp: daysAgo(4),
      },
      {
        id: 'msg_013b',
        role: 'seller',
        content: `Hi Thomas, I'm sorry to hear about the motor issue! Yes, our standing desk frames come with a 3-year warranty on the motor and frame components.

To process your warranty claim, I'll need:
1. Your order number (I can see it's 112-1111222-3334444)
2. A brief video showing the issue (the one-sided lifting)
3. The serial number from the control box (usually on a sticker on the underside)

Once I have these, I can get a replacement motor shipped out to you. The installation is pretty straightforward - just involves unplugging the old motor and plugging in the new one.`,
        timestamp: daysAgo(4),
      },
      {
        id: 'msg_013c',
        role: 'buyer',
        content: `Great, thanks! Here's the info:
- Order number confirmed
- Video attached showing the right side not moving at all while left side goes up
- Serial number: DESK-2025-03847-DM

Question - will I need any special tools for the motor swap? And do I need to send the defective motor back?`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_013d',
        role: 'seller',
        content: `Perfect, thank you Thomas! I've reviewed the video and confirmed the warranty claim. Your replacement motor is being shipped today.

To answer your questions:
- Tools needed: Just a Phillips head screwdriver to remove the motor mounting plate (4 screws)
- No need to return the defective motor - you can dispose of it or recycle it locally

The new motor should arrive in 3-5 business days. I'm including installation instructions in the package, but feel free to reach out if you hit any snags during the swap.

Is there anything else you need help with?`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_013e',
        role: 'buyer',
        content: `Got the replacement motor yesterday, but I'm having trouble with the installation. I removed the 4 screws and the old motor came off fine, but the new motor connector looks different from the port on the control box. The old motor had a 3-pin connector but this new one has 5 pins. Did you send the wrong motor?`,
        timestamp: hoursAgo(5),
      },
    ],
  },

  // Case 14: Size exchange with multiple back-and-forth
  {
    id: 'case_014',
    orderId: '112-7890123-4567890',
    buyerName: 'Jennifer Collins',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Return/Refund/Replace',
    status: 'needs_response',
    dueHours: 10,
    lastMessageAt: hoursAgo(10),
    subject: 'Size exchange needed - Running Shoes',
    product: {
      name: 'CloudRunner Pro Running Shoes - Women\'s',
      image: 'https://m.media-amazon.com/images/I/71zY35HmVzL._AC_SX425_.jpg',
      asin: 'B0BN8FWKQ5',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Nov 25, 2025 4:20 PM EST',
      shipBy: 'Nov 27, 2025 5:00 PM EST',
      deliverBy: 'Dec 4, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_014a',
        role: 'buyer',
        content: `Hi! I love these shoes but I ordered size 8 and they're a bit too snug. Do you offer exchanges? I'd like to try size 8.5 instead.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_014b',
        role: 'seller',
        content: `Hi Jennifer! Glad you like the shoes! We can definitely help with an exchange. A couple options for you:

Option 1 (Fastest): Order the size 8.5 now, and return the size 8 for a full refund. This way you get the new size as soon as possible.

Option 2 (Traditional exchange): Return the size 8, and once we receive it, we'll ship out the 8.5. This takes about 7-10 days total.

Which would you prefer? Also, just a heads up - our CloudRunner Pro tends to run a half size small, so 8.5 should be perfect for you!`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_014c',
        role: 'buyer',
        content: `I'll do option 1 since I have a race coming up! But when I tried to order the 8.5, it shows as out of stock 😭 Any idea when it'll be back? Or do you have any in your warehouse?`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_014d',
        role: 'seller',
        content: `Oh no! Let me check our inventory... 

Good news - I found a pair of 8.5 in the Pink/White colorway. We're currently out of the Black colorway you originally ordered, but the Pink/White should be back in stock early next week.

Would you like me to:
A) Ship the Pink/White 8.5 now
B) Reserve a Black 8.5 for you when it's back (expected Monday/Tuesday)

When is your race? I want to make sure you have them in time!`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_014e',
        role: 'buyer',
        content: `Race is December 14th so I have some time. I really wanted black though since it goes with more outfits. Can you guarantee the Black will be available next week? If you can reserve one for me that would be amazing!`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_014f',
        role: 'seller',
        content: `Absolutely! I've put a note on our incoming shipment to reserve a Black 8.5 for you. The shipment is confirmed for Monday delivery to our warehouse, so I should be able to ship yours out Monday or Tuesday.

In the meantime, please start your return for the size 8 - you can generate a prepaid label through your Amazon orders page. No rush on sending it back; the return window is 30 days.

I'll message you Monday to confirm the 8.5 shipped. You'll definitely have them well before your race! 🏃‍♀️`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_014g',
        role: 'buyer',
        content: `Thank you so much! I printed the return label and will drop it off tomorrow. Quick question - I see you also sell insoles. Would you recommend any for extra cushioning? My last marathon my feet were killing me by mile 20.`,
        timestamp: hoursAgo(10),
      },
    ],
  },

  // Case 15: Complex multi-item order issue
  {
    id: 'case_015',
    orderId: '112-5678901-2345678',
    buyerName: 'Richard Okonkwo',
    buyerType: 'Business Buyer',
    country: 'US',
    language: 'English',
    topic: 'Order Issue',
    status: 'needs_response',
    dueHours: 2,
    lastMessageAt: hoursAgo(2),
    subject: 'Multiple items wrong/missing - Office Supply Order',
    product: {
      name: 'Office Supply Bundle - Desk Organization Kit',
      image: 'https://m.media-amazon.com/images/I/81yJnUk1gaL._AC_SX425_.jpg',
      asin: 'B0C9SK8J2M',
      quantity: 5,
    },
    order: {
      purchaseDate: 'Nov 28, 2025 10:00 AM EST',
      shipBy: 'Nov 30, 2025 5:00 PM EST',
      deliverBy: 'Dec 7, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_015a',
        role: 'buyer',
        content: `I ordered 5 of the desk organization kits for our new office space. Major problems with this order:
1. Only received 4 boxes
2. One of the boxes had the wrong item (got a monitor stand instead of the organization kit)
3. Two of the kits are missing the pen holder component

This is for a business and I need everything sorted before our office opens Monday. Please advise.`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_015b',
        role: 'seller',
        content: `Hi Richard, I sincerely apologize for all these issues with your order! This is definitely not up to our standards. Let me help sort this out:

For the missing 5th kit: I'll ship one out today via expedited shipping - should arrive Friday.

For the wrong item (monitor stand): Please keep it as an apology for the inconvenience, no need to return it. I'll include a correct organization kit with the Friday shipment.

For the 2 kits missing pen holders: I can either ship replacement pen holders separately, or if you prefer, I can send 2 complete new kits and you keep the incomplete ones for spare parts.

Which would you prefer for the pen holder situation? And can you confirm your shipping address is still correct?`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_015c',
        role: 'buyer',
        content: `Thanks for the quick response. Address is correct. I'd prefer the replacement pen holders separately since the rest of the kits are fine and I don't want to deal with more boxes than necessary.

Also, since this is for a business, I need an invoice showing the correct quantities for our accounting. The current invoice shows 5 kits but we effectively received less.`,
        timestamp: hoursAgo(20),
      },
      {
        id: 'msg_015d',
        role: 'seller',
        content: `Understood! Here's what I'm sending:
- 1 complete desk organization kit (the missing 5th unit)
- 2 replacement pen holders
- 1 additional complete kit (to replace the monitor stand mixup)

All shipping via FedEx Overnight - tracking number: 789456123098

Regarding the invoice: I'll generate a corrected invoice showing:
- 5 Desk Organization Kits (original order)
- 2 Replacement Components (no charge)
- 1 Complimentary Kit (for the inconvenience)
- Monitor Stand (keep, no charge)

I'll email the PDF invoice directly to your Amazon account email within the hour. Would you also like me to CC a different email for your accounting department?`,
        timestamp: hoursAgo(18),
      },
      {
        id: 'msg_015e',
        role: 'buyer',
        content: `Yes please CC accounting@okonkwopartners.com

One more thing - the tracking shows delivery for Friday but our office is closed Friday for the holiday. Can you change delivery to Thursday, or have it held at the FedEx location for Saturday pickup?`,
        timestamp: hoursAgo(2),
      },
    ],
  },

  // Case 16: International shipping inquiry with language consideration
  {
    id: 'case_016',
    orderId: '112-9012345-6789012',
    buyerName: 'Marie Dubois',
    buyerType: null,
    country: 'FR',
    language: 'French',
    topic: 'Shipping Inquiry',
    status: 'needs_response',
    dueHours: 14,
    lastMessageAt: hoursAgo(14),
    subject: 'Délai de livraison - Commande internationale',
    product: {
      name: 'Vintage Leather Journal - Handmade',
      image: 'https://m.media-amazon.com/images/I/81kFrX6MAPL._AC_SX425_.jpg',
      asin: 'B0798FVS8P',
      quantity: 3,
    },
    order: {
      purchaseDate: 'Nov 20, 2025 8:30 AM EST',
      shipBy: 'Nov 22, 2025 5:00 PM EST',
      deliverBy: 'Dec 15, 2025 8:00 PM CET',
    },
    messages: [
      {
        id: 'msg_016a',
        role: 'buyer',
        content: `Bonjour, j'ai commandé 3 journaux pour offrir à Noël. Le suivi montre que le colis est "en transit" depuis 10 jours maintenant. Est-ce normal pour une livraison en France? Je m'inquiète qu'il n'arrive pas à temps pour les fêtes.`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_016b',
        role: 'seller',
        content: `Bonjour Marie! Merci de nous avoir contactés.

Je comprends votre inquiétude concernant votre commande pour Noël. J'ai vérifié le suivi et votre colis est actuellement en transit international - il devrait arriver au centre de douanes français dans les 2-3 prochains jours.

Pour les envois vers la France, le délai total est généralement de 14-21 jours. Votre colis est dans les temps pour une livraison avant le 15 décembre.

Je vais surveiller votre envoi et vous tiendrai informée s'il y a des retards. Est-ce que ces journaux sont pour des cadeaux professionnels ou personnels? Je veux m'assurer qu'ils arrivent à temps!`,
        timestamp: daysAgo(3),
      },
      {
        id: 'msg_016c',
        role: 'buyer',
        content: `Merci pour votre réponse rapide! Ce sont des cadeaux personnels pour mes sœurs. 

J'ai une autre question - est-ce qu'il y aura des frais de douane supplémentaires à payer? Je n'ai jamais commandé depuis les États-Unis avant.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_016d',
        role: 'seller',
        content: `Pour les cadeaux de vos sœurs, je suis sûre qu'elles vont adorer nos journaux en cuir!

Concernant les frais de douane: comme votre commande est en dessous de 150€, normalement il n'y aura pas de droits de douane. Cependant, la TVA française (20%) peut être appliquée. La plupart du temps, pour les petits colis, cela passe sans frais supplémentaires, mais je ne peux pas le garantir à 100%.

Si des frais de douane sont demandés et que vous les trouvez excessifs, contactez-moi et nous trouverons une solution ensemble.

Bonne nouvelle: le suivi vient d'être mis à jour - votre colis est arrivé à Paris CDG ce matin! 🎉`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_016e',
        role: 'buyer',
        content: `Super nouvelle! Merci beaucoup pour ces informations. Une dernière question - les journaux sont-ils emballés individuellement? J'aimerais éviter de devoir acheter du papier cadeau supplémentaire si possible.`,
        timestamp: hoursAgo(14),
      },
    ],
  },

  // Case 17: Tech product not as described - multiple updates
  {
    id: 'case_017',
    orderId: '112-2345098-7654321',
    buyerName: 'Kevin Zhang',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Product Issue',
    status: 'needs_response',
    dueHours: 1,
    lastMessageAt: hoursAgo(1),
    subject: 'Specs don\'t match listing - Mechanical Keyboard',
    product: {
      name: 'RGB Mechanical Gaming Keyboard - Cherry MX Red',
      image: 'https://m.media-amazon.com/images/I/71gYfZ2PREJUDL._AC_SX425_.jpg',
      asin: 'B0C3XYZQ2M',
      quantity: 1,
    },
    order: {
      purchaseDate: 'Nov 30, 2025 7:45 PM EST',
      shipBy: 'Dec 2, 2025 5:00 PM EST',
      deliverBy: 'Dec 9, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_017a',
        role: 'buyer',
        content: `Just got my keyboard and it has Outemu Red switches, NOT Cherry MX Red as advertised. This is false advertising. Cherry MX switches are a premium product and I specifically ordered this because the listing said Cherry MX. The Outemu switches are a budget knockoff.`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_017b',
        role: 'seller',
        content: `Hi Kevin, thank you for bringing this to my attention. I'm very concerned about what you're describing.

Our keyboards should indeed have Cherry MX Red switches as listed. Can you please:
1. Send a photo of the switch (you can gently remove a keycap to see the switch underneath)
2. Let me know where you purchased from - was it directly from our store "TechKeys Official" or another seller?

If this is a counterfeit or mislabeled product that somehow got into our inventory, I want to know immediately so we can address it. Either way, I'll make this right for you.`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_017c',
        role: 'buyer',
        content: `Photo attached. You can clearly see it says "Outemu" on the switch housing. I purchased directly from the listing that shows "Ships from and sold by TechKeys Official."

This is either bait-and-switch or you're getting counterfeit products from your supplier. Either way not cool.`,
        timestamp: hoursAgo(20),
      },
      {
        id: 'msg_017d',
        role: 'seller',
        content: `You're absolutely right, and I sincerely apologize. After seeing your photo and checking our recent inventory shipment, I discovered that our supplier sent us a batch with Outemu switches instead of Cherry MX. This is completely unacceptable and we're addressing it with them immediately.

Here's what I'm doing:
1. Full refund processing now - you'll see it in 3-5 business days
2. You can keep the keyboard (or donate/recycle it)
3. I'm sending you a verified Cherry MX Red keyboard from our confirmed stock - expedited shipping, arrives Thursday
4. Including a $30 gift card for your trouble

I'm also pulling the remaining affected units from inventory and updating our QC process. Thank you for alerting us to this - you may have saved other customers from the same issue.

Again, my deepest apologies for this experience.`,
        timestamp: hoursAgo(18),
      },
      {
        id: 'msg_017e',
        role: 'buyer',
        content: `I appreciate you owning up to it and taking action. Got the tracking number for the replacement. One question - I actually wanted to give the Outemu keyboard to my nephew who's getting into gaming. Is there any documentation I should include or will it work fine as a standalone unit without warranty since it's the wrong switches?`,
        timestamp: hoursAgo(1),
      },
    ],
  },

  // Case 18: Subscription/recurring order issue
  {
    id: 'case_018',
    orderId: '112-8765432-1098765',
    buyerName: 'Sandra Miller',
    buyerType: null,
    country: 'US',
    language: 'English',
    topic: 'Subscription Issue',
    status: 'needs_response',
    dueHours: 9,
    lastMessageAt: hoursAgo(9),
    subject: 'Wrong quantity in Subscribe & Save delivery',
    product: {
      name: 'Organic Coffee Beans - Medium Roast 2lb',
      image: 'https://m.media-amazon.com/images/I/71B5qJq9qQL._AC_SX425_.jpg',
      asin: 'B07W55N4WZ',
      quantity: 2,
    },
    order: {
      purchaseDate: 'Dec 1, 2025 12:00 AM EST',
      shipBy: 'Dec 3, 2025 5:00 PM EST',
      deliverBy: 'Dec 10, 2025 8:00 PM EST',
    },
    messages: [
      {
        id: 'msg_018a',
        role: 'buyer',
        content: `I've been on Subscribe & Save for your coffee for 8 months and it's been great. But my last 2 deliveries have only had 1 bag instead of 2. I'm being charged for 2 bags but only getting 1. This month's delivery just came and same issue again.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_018b',
        role: 'seller',
        content: `Hi Sandra! Thank you for being such a loyal subscriber - 8 months is amazing! I'm sorry to hear about these missing bags though.

I've looked at your account and I see what happened - it looks like Amazon's system changed your subscription quantity from 2 to 1 during a recent system update (this affected some long-term subscribers unfortunately).

Here's what I'm doing:
1. Refund for the missing bag this month: processing now
2. Refund for last month's missing bag: processing now
3. I've flagged your subscription to our team to manually verify quantities going forward

Can you check your Subscribe & Save settings on Amazon to confirm it shows 2 bags? If it shows 1, you may need to update it on your end as well.`,
        timestamp: daysAgo(2),
      },
      {
        id: 'msg_018c',
        role: 'buyer',
        content: `Thank you! I checked and you're right - it was showing 1. I've updated it back to 2. 

I should have caught that earlier but I just assumed it would stay the same. Appreciate the refunds. Will my next delivery (scheduled Dec 15) be correct now?`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_018d',
        role: 'seller',
        content: `Yes, your December 15th delivery should now be for 2 bags! I've added a note to your account so our warehouse team will double-check the quantity when packing.

Since you mentioned you've been short on coffee for 2 months, would you like me to send a complimentary bag now to tide you over until the 15th? I'd hate for you to run out because of our error.

Also, as a thank you for being such a great long-term subscriber, I'm adding you to our "Coffee Club" list which gives you early access to new roasts and seasonal blends before they go public. 🎉`,
        timestamp: daysAgo(1),
      },
      {
        id: 'msg_018e',
        role: 'buyer',
        content: `Wow that's so nice of you! Yes I would love a complimentary bag - I was actually about to go buy some from the grocery store to hold me over lol. And the Coffee Club sounds awesome! Do I need to sign up for anything or is it automatic?`,
        timestamp: hoursAgo(9),
      },
    ],
  },
]
