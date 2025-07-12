import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import Parametres from '@/views/parametres.vue';
import Permissions from '@/views/permissions.vue';
import GuichetProfile from '@/services/guichetProfile.vue';
import HistoriqueClient from '@/services/historiqueClient.vue';
import Guichet from '@/views/menu/Guichet.vue';
import mandataire from '@/views/menu/mandataire.vue';
// import GuichetCompteIndividuel from '@/views/menu/guichet/GuichetCompteIndividuel.vue';
// import GuichetCompteMorale from '@/views/menu/guichet/GuichetCompteMorale.vue';
import Credit from '@/views/menu/Credit.vue';
import CreditDetail from '@/views/menu/CreditDetail.vue';
import Placement from '@/views/menu/placement/Placement.vue';
import Ammortissement from '@/views/menu/placement/Ammortissement.vue';
import Interet from '@/views/menu/placement/Interet.vue';
import Impots from '@/views/menu/placement/Impots.vue';
import Historiques from '@/views/menu/Historiques.vue';
import Cheques from '@/views/menu/Cheques.vue';
import epargne from '@/views/menu/epargne.vue';
import Quittances from '@/views/menu/Quittances.vue';
import Depense from '@/views/menu/Depense.vue';
import Capital from '@/views/menu/Microfinance/capital.vue';
import Actionnaire from '@/views/menu/Microfinance/Actionnaire.vue';
import HistoriqueMicro from '@/views/menu/Microfinance/historiqueMicro.vue';
import Microfinance from '@/views/menu/Microfinance/microfinanceInfo.vue';

import CompteBancaire from '@/views/banque/CompteBancaire.vue';
import CreditBanques from '@/views/banque/CreditBanques.vue';
import DepotBanques from '@/views/banque/DepotBanques.vue';
import RetraitBanques from '@/views/banque/RetraitBanques.vue';

import Plan_comptable from '@/views/comptabilite/Plan_comptable.vue';
import Journal from '@/views/comptabilite/Journal.vue';
import Grant_livre from '@/views/comptabilite/Grant_livre.vue';
import Balance from '@/views/comptabilite/Balance.vue';
import Bilan from '@/views/comptabilite/Bilan.vue';
import Compte_de_resultats from '@/views/comptabilite/Compte_de_resultats.vue';
import Flux_de_la_tresorie from '@/views/comptabilite/Flux_de_la_tresorie.vue';

import PrintCheque from '@/services/print_cheques.vue';
import prix from '@/components/prix.vue';
import Remise_agences from '@/views/remise_reprise/remise_agences.vue';
import Remise_personnels from '@/views/remise_reprise/remise_personnels.vue';
import Print_quittances from '@/services/print_quittances.vue';
import Salarier from '@/views/menu/Salarier.vue';
import RembourssementBanques from '@/views/banque/RembourssementBanques.vue';
import DepotMicrofinance from '@/views/menu/Microfinance/DepotMicrofinance.vue';
import RetraitMicrofinance from '@/views/menu/Microfinance/RetraitMicrofinance.vue';
import VirementPermanent from '@/views/VirementPermanent.vue';
import Investissement from '@/views/menu/Microfinance/Investissement.vue';

import Depots from '@/views/menu/more/Depots.vue';
import Retraits from '@/views/menu/more/Retraits.vue';
import Virements from '@/views/menu/more/Virements.vue';
import DepotEpargne from '@/views/menu/more/DepotEpargne.vue';

const routes = [

  { path: '/', name: 'Acueil', component: HomePage, meta: { requiresAuth: true } },
  { path: '/parametres', name: 'Parametres', component: Parametres },
  { path: '/permissions', name: 'Groups', component: Permissions },
  { path: '/prix', name: 'Prix', component: prix },
  // Services
  { path: '/menu/guichet/guichetProfile', name: 'GProfile', component: GuichetProfile },
  { path: '/menu/guichet/historique', name: 'HistoriqueClient', component: HistoriqueClient },

  // -------------------------------------------MENU LINKS
  { path: '/menu/guichet/guichet', name: 'Guichet', component: Guichet },
  { path: '/menu/mandataire/', name: 'mandataire', component: mandataire },
  // { path: '/menu/Guichet/GuichetCompteIndividuel', name: 'Physique', component: GuichetCompteIndividuel },
  // { path: '/menu/Guichet/GuichetCompteMorale', name: 'Morale', component: GuichetCompteMorale },
  { path: '/menu/credit', name: 'credit', component: Credit },
  { path: '/menu/credit/:id', name: 'credit/:id', component: CreditDetail },
  { path: '/menu/placement', name: 'placement', component: Placement },
  { path: '/menu/placement/ammortissement', name: 'Ammortissement', component: Ammortissement },
  { path: '/menu/placement/interet', name: 'Interet', component: Interet },
  { path: '/menu/placement/impots/:compte', name: 'Impots', component: Impots },
  { path: '/menu/historiques/:id', name: 'historiques/:id', component: Historiques },
  { path: '/menu/cheques', name: 'cheques', component: Cheques },
  { path: '/menu/epargne', name: 'epargne', component: epargne },
  { path: '/menu/quittances', name: 'quittances', component: Quittances },
  { path: '/menu/salarier', name: 'salarier', component: Salarier},
  { path: '/menu/depense', name: 'Depense', component: Depense },
  { path: '/capital', name: 'Capital', component: Capital },
  { path: '/actionnaire', name: 'Actionnaire', component: Actionnaire },
  { path: '/HistoriqueMicrofinance', name: 'HistoriqueMicro', component: HistoriqueMicro },

  // ---------------------------------------- BANQUE 
  { path: '/banque/comptebancaire', name: 'comptebancaire', component: CompteBancaire },
  { path: '/banque/creditbanques', name: 'creditbanques', component: CreditBanques },
  { path: '/banque/depotbanques', name: 'depotbanques', component: DepotBanques },
  { path: '/banque/retraitbanques', name: 'retraitbanques', component: RetraitBanques },
  { path: '/banque/rembourssementbanques', name: 'rembourssementbanques', component: RembourssementBanques },

  // ----------------------------------------COMPTABILITY ELEMENTS

  { path: '/comptabilite/plan_comptable', name: 'Plan Comptable', component: Plan_comptable },
  { path: '/comptabilite/journal', name: 'Journal', component: Journal },
  { path: '/comptabilite/grand_livre', name: 'Grand Livre', component: Grant_livre },
  { path: '/comptabilite/balance', name: 'Balance', component: Balance },
  { path: '/comptabilite/bilan', name: 'Bilan', component: Bilan },
  { path: '/comptabilite/compte_de_resultats', name: 'Compte de resultats', component: Compte_de_resultats },
  { path: '/comptabilite/flux_de_la_tresorie', name: 'Flux de la tresorie', component: Flux_de_la_tresorie },

  { path: '/cheques/print-cheques', name: 'print-cheques', component: PrintCheque },
  { path: '/remise_reprise_agences/:agenceNom', name: 'Remise agences', component: Remise_agences },
  { path: '/remise_reprise_personnels', name: 'Remise personnels', component: Remise_personnels },
  { path: '/printquittances', name: 'Print Quittances', component: Print_quittances },

  { path: '/microfinance', name: 'Microfinance', component: Microfinance },
  { path: '/depotmicrofinance/:id', name: 'depotmicrofinance', component: DepotMicrofinance },
  { path: '/retraitmicrofinance/:id', name: 'retraitmicrofinance', component: RetraitMicrofinance }, 

  { path: '/virementpermanent/:id', name: 'virementpermanent', component: VirementPermanent },  
  { path: '/Investissement/:id', name: 'Investissement', component: Investissement }, 

  { path: '/depots/:compte', name: 'Depots', component: Depots },  
  { path: '/retraits/:compte', name: 'retraits', component: Retraits },  
  { path: '/virements/:compte', name: 'virements', component: Virements },  
  
  { path: '/depot_epargne/:compte', name: 'Depots Epargne', component: DepotEpargne },  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;