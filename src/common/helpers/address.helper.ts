import { Address } from "../../models/entities/address";

export abstract class AddressHelper {

    public static format(
        address: Address,
        options: { includeComplement?: boolean } = { includeComplement: true }
    ): string {

        if (!address)
            return null;

        let addressStr = '';

        addressStr += address.street;
        addressStr += address.number ? `, ${address.number}` : '';

        if (options.includeComplement)
            addressStr += address.complement ? ` (${address.complement}${address.referencePoint ? ' - ' + address.referencePoint : ''})` : '';

        addressStr += address.neighborhood ? ` - ${address.neighborhood}` : '';
        addressStr += ` - ${address.city}`;
        addressStr += ` - ${address.region}`;

        return addressStr;
    }
}