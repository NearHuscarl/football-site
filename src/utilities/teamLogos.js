// Here is a list of the updated logo urls for some teams',
// Normally the logo is cache on firebase to limit number of API calls',
// But some links are old and missing so latest urls are patched here',

const teamLogoUrls = {
	// Eredivisie
	668:
		'https://upload.wikimedia.org/wikipedia/en/thumb/6/60/VVV-Venlo_logo.svg/800px-VVV-Venlo_logo.svg.png',
	680:
		'https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/ADO_Den_Haag_logo.svg/800px-ADO_Den_Haag_logo.svg.png',
	681:
		'https://upload.wikimedia.org/wikipedia/commons/c/c9/Logo_NAC_Breda.png',
	1913:
		'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/VBV_De_Graafschap_Doetinchem.svg/800px-VBV_De_Graafschap_Doetinchem.svg.png',
	1914:
		'https://upload.wikimedia.org/wikipedia/en/thumb/8/83/FC_Emmen_logo.svg/800px-FC_Emmen_logo.svg.png',
	1920:
		'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Fortuna_Sittard_logo.svg/800px-Fortuna_Sittard_logo.svg.png',

	// La Liga
	77:
		'https://upload.wikimedia.org/wikipedia/vi/8/8c/Athletic_c_de_bilbao.gif',
	88:
		'https://upload.wikimedia.org/wikipedia/en/7/7b/Levante_Uni%C3%B3n_Deportiva%2C_S.A.D._logo.svg',
	559:
		'https://upload.wikimedia.org/wikipedia/vi/4/45/Sevilla_fc.gif',

	// Ligue 1
	511:
		'https://upload.wikimedia.org/wikipedia/en/8/8b/Toulouse_FC.png',
	514:
		'https://upload.wikimedia.org/wikipedia/en/a/aa/SM_Caen_2016_logo.svg',
	518:
		'https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Montpellier_HSC_logo.svg/200px-Montpellier_HSC_logo.svg.png',
	521:
		'https://upload.wikimedia.org/wikipedia/en/6/6f/Lille_OSC_2018_logo.png',
	522:
		'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg',
	523:
		'https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg',
	524:
		'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
	526:
		'https://upload.wikimedia.org/wikipedia/en/1/11/FC_Girondins_de_Bordeaux_logo.svg',
	528:
		'https://upload.wikimedia.org/wikipedia/en/f/f7/Dijon_FCO_logo.svg',
	529:
		'https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC.svg',
	530:
		'https://upload.wikimedia.org/wikipedia/en/f/f6/Amiens_SC_Logo.svg',
	532:
		'https://upload.wikimedia.org/wikipedia/en/d/d4/Angers_SCO_logo.svg',
	538:
		'https://upload.wikimedia.org/wikipedia/en/1/12/EA_Guingamp_logo.svg',
	543:
		'https://upload.wikimedia.org/wikipedia/en/1/14/FC_Nantes_logo.png',
	547:
		'https://upload.wikimedia.org/wikipedia/en/f/f0/Stade_de_Reims_logo.png',
	548:
		'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
	556:
		'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/N%C3%AEmes_Olympique.png/200px-N%C3%AEmes_Olympique.png',
	576:
		'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Racing_Club_de_Strasbourg_logo.svg/800px-Racing_Club_de_Strasbourg_logo.svg.png',
	
	// Championship
	59:
		'https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg',
	60:
		'https://upload.wikimedia.org/wikipedia/en/8/82/Bolton_Wanderers_FC_logo.svg',
	74:
		'https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg',
	322:
		'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/Hull_City_Crest_2014.svg/800px-Hull_City_Crest_2014.svg.png',
	341:
		'https://upload.wikimedia.org/wikipedia/en/0/05/Leeds_United_Logo.png',
	355:
		'https://upload.wikimedia.org/wikipedia/en/1/11/Reading_FC.svg',
	387:
		'https://upload.wikimedia.org/wikipedia/en/e/ed/Bristol_City_FC_logo.png',
	402:
		'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Brentford_FC_crest.svg/800px-Brentford_FC_crest.svg.png',
	1081:
		'https://upload.wikimedia.org/wikipedia/en/2/21/PNE_FC.png',

	// Primeira Liga
	496:
		'https://upload.wikimedia.org/wikipedia/en/8/84/Rio_Ave_FC.png',
	498:
		'https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo%29.svg',
	1903:
		'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/800px-SL_Benfica_logo.svg.png',
	5529:
		'https://upload.wikimedia.org/wikipedia/en/9/96/C.D._Nacional.gif',
	5530:
		'https://upload.wikimedia.org/wikipedia/en/thumb/3/37/C.D._Santa_Clara_logo.svg/800px-C.D._Santa_Clara_logo.svg.png',
	5543:
		'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Vit%C3%B3ria_Guimar%C3%A3es.svg/800px-Vit%C3%B3ria_Guimar%C3%A3es.svg.png',
	5544:
		'https://upload.wikimedia.org/wikipedia/en/5/51/CD_Aves_logo.png',
	5565:
		'https://upload.wikimedia.org/wikipedia/en/2/2a/CD_Feirense.png',
	5568:
		'https://upload.wikimedia.org/wikipedia/en/2/2a/Os_Belenenses.png',
	5575:
		'https://upload.wikimedia.org/wikipedia/en/6/67/Club_Sport_Mar%C3%ADtimo.png',
	5601:
		'https://upload.wikimedia.org/wikipedia/en/e/e9/Portimonense_Sporting_Clube.png',
	5613:
		'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/S.C._Braga_logo.svg/800px-S.C._Braga_logo.svg.png',
	5620:
		'https://upload.wikimedia.org/wikipedia/en/0/05/Vit%C3%B3ria_F.C._logo.png',
	584:
		'https://upload.wikimedia.org/wikipedia/en/d/d2/U.C._Sampdoria_logo.svg',
	1107:
		'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Spal2013_logo.svg/800px-Spal2013_logo.svg.png',

	// Series A
	108:
		'https://upload.wikimedia.org/wikipedia/en/0/0b/Inter_Milan.svg',
	99:
		'https://upload.wikimedia.org/wikipedia/en/b/ba/ACF_Fiorentina_2.svg',
}

export default teamLogoUrls;
