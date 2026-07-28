export type SimulatorInput={location:string;type:string;bedrooms:number;guests:number;area:number;finish:string;sea:boolean;pool:boolean;terrace:boolean;parking:boolean;days:number};
export type RevenueEstimate={annual:number;low:number;high:number;nightly:number;occupancy:number;bookedNights:number;monthlyAverage:number;seasonHigh:number;seasonLow:number};

const base:Record<string,number>={Gênes:155,Nervi:190,Camogli:215,Rapallo:205,"Santa Margherita Ligure":245,Portofino:340,"Autre localité en Ligurie":165};

export function calculateRevenueEstimate(i:SimulatorInput):RevenueEstimate{
 const type={Appartement:1,Attique:1.18,Villa:1.38,"Maison indépendante":1.2}[i.type]||1;
 const finish={Essentiel:.82,Soigné:1,Premium:1.22,Luxe:1.48}[i.finish]||1;
 const amenity=1+(i.sea?.16:0)+(i.pool?.15:0)+(i.terrace?.07:0)+(i.parking?.04:0);
 const size=1+Math.min(Math.max(i.bedrooms-1,0)*.13,.52)+Math.min(Math.max(i.area-70,0)/1000,.16);
 const capacity=1+Math.min(Math.max(i.guests-2,0)*.018,.15);
 const occupancy=Math.min(76,Math.round(49+(i.sea?5:0)+(i.finish==="Luxe"?6:i.finish==="Premium"?3:0)+(i.location==="Portofino"?3:0)+(i.pool?2:0)));
 const nightly=Math.round((base[i.location]||165)*type*finish*amenity*size*capacity);
 const bookedNights=Math.round(i.days*(occupancy/100));
 const annual=Math.round(nightly*bookedNights/100)*100;
 return{
  annual,
  low:Math.round(annual*.82/100)*100,
  high:Math.round(annual*1.18/100)*100,
  nightly,
  occupancy,
  bookedNights,
  monthlyAverage:Math.round(annual/12/100)*100,
  seasonHigh:Math.round(nightly*1.42),
  seasonLow:Math.round(nightly*.68),
 };
}
