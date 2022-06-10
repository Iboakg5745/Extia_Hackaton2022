// import stripe from 'stripe';
// import { IUser } from '../database/models/userSchema';

// const Stripe = stripe(process.env.STRIPE_KEY!);

// export async function generateFakeCard() {
//     try {
//         const paymentMethod = await Stripe.paymentMethods.create({
//             type: 'card',
//             card: {
//               number: '4242424242424242',
//               exp_month: 12,
//               exp_year: 2022,
//               cvc: '314',
//             },
//           });
//         return paymentMethod;
//     } catch (error) {
//         return error;
//     }
// }

// export async function linkCard(user: IUser, cardId: string) {
//     try {
//         const paymentMethod = await Stripe.paymentMethods.attach(
//             cardId,
//             {customer: user.stripeId}
//           );
//         await Stripe.customers.update(
//             user.stripeId,
//             {
//                 invoice_settings: {default_payment_method: cardId}
//             }
//           );
//         return paymentMethod;
//     } catch (error) {
//         return error.raw.message;
//     }
// }

// export async function createPayment(user: IUser, amount: number, description: string) {
//     try {

//         // const userInfo = await stripeUserInfo(req.headers.authorization);
//         // const customer = {stripeId: '151515', email: 'mathieu@epitech.eu'};

//         const customer = await Stripe.customers.retrieve(
//             user.stripeId
//         );
//         const paymentIntent = await Stripe.paymentIntents.create({
//           amount: amount,
//           currency: "eur",
//           customer: user.stripeId,
//           description: description,
//           receipt_email: user.email,
//           payment_method: customer.invoice_settings.default_payment_method,
//           confirm: true
//         });

//         return paymentIntent;
//     } catch (error) {
//         return error.raw.message;
//     }
// }