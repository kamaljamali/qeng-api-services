/**
 * Personal information type
 */
export type IdentificationCertificateType = {
    firsName: string;
    lastName: string;
    latinFirstName: string;
    latinLastName: string;
    fatherName: string;
    identificationCertificateNumber: string;
    identificationSerial: {
        alphabetic: string;
        number: string;
        serialText: string;
    };
    nation: string;
    birthProvince: string;
    birthCity: string;
    birthDate: string;
    identificationCertificateExportPlace: string;
    identificationCertificateExportDate: string;
    identificationCertificateExportZone: string;
};
