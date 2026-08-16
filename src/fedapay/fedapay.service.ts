import { Injectable, OnModuleInit } from '@nestjs/common';
import { FedaPay, Transaction } from 'fedapay';

@Injectable()
export class FedapayService implements OnModuleInit{
    onModuleInit() {
        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);
        FedaPay.setEnvironment(process.env.FEDAPAY_ENVIRONMENT ?? 'sandbox ');
    }

    async creerTransactionEtLienPaiement(params: {
        montant: number;
        description: string;
        participantNom: string;
        participantEmail: string;
    }) {
        const [prenom, ...resteNom] = params.participantNom.trim().split(' ');
        const nom = resteNom.length > 0 ? resteNom.join(' ') : prenom;

        const transaction = await Transaction.create({
            description: params.description,
            amount:Math.round(params.montant),
            currency: {iso: 'XOF'},
            callback_url: process.env.FEDAPAY_CALLBACK_URL!,
            customer: {
                firstname: prenom,
                lastname: nom,
                email: params.participantEmail
            }
        });

        const { token, url } = await transaction.generateToken();

        return {transactionId: transaction.id, token, paymentUrl: url};
    }
}
