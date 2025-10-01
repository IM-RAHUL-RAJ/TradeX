import { PortfolioPosition } from "./portfolio.model";
import { InvestmentPreferences } from "./preferences.model";

export interface ClientIdentification {
type: string;
value: string;
}

export interface Client {
email: string;
clientId: string;
password:string;
dateOfBirth: string;
country: string;
postalCode: string;
identification: ClientIdentification[];
preferences?: InvestmentPreferences;
cashBalance: number;
portfolio: PortfolioPosition[];
}