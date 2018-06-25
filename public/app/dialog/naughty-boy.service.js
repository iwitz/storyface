angular.module('storyface')
	.service('naughtyBoyService',
        ['$mdDialog',
        'userInfoService',
        '$translate',
		function naughtyBoyService($mdDialog, userInfoService, $translate){
            this.warningsSuccess = {
                'en' : [
                    {
                        male : "Aren't you afraid of being seen as a licentious man?",
                        female : "Aren't you afraid of being seen as a licentious woman?"
                    },
                    {
                        male : "We can not guarantee that your repeated attempts will remain confidential.",
                        female : "We can not guarantee that your repeated attempts will remain confidential."
                    },
                    {
                        male : "That's exaggerated, you're a flirt!",
                        female : "That's exaggerated, you're a flirt!"
                    },
										{
                        male : "Thank you for this generous data sharing.",
                        female : "Thank you for this generous data sharing."
                    },
                ],
                'fr' : [
                    {
                        male : "Ne craignez-vous pas d'être pris pour un homme facile?",
                        female : "Ne craignez vous pas d'être prise pour une fille facile?"
                    },
                    {
                        male : "Nous ne pouvons pas vous garantir que vos tentatives réitérées resteront confidentielles.",
                        female : "Nous ne pouvons pas vous garantir que vos tentatives réitérées resteront confidentielles."
                    },
                    {
                        male : "Vous exagérez, vous êtes en train de draguer !",
                        female : "Vous exagérez, vous êtes en train de draguer !"
                    },
										{
                        male : "Merci pour ce généreux partage de données.",
                        female : "Merci pour ce généreux partage de données."
                    },
                    {
                        male : "Qu'est-ce que vous recherchez exactement ?",
                        female : "Qu'est-ce que vous recherchez exactement ?"
                    },
                    {
                        male : "Ce site comporte des risques d'addiction... attention...",
                        female : "Ce site comporte des risques d'addiction... attention..."
                    },
                    {
                        male : "Saurez-vous vous arrêter à temps ?",
                        female : "Saurez-vous vous arrêter à temps ?"
                    },
                    {
                        male : "Vous avez vraiment donné votre numéro de téléphone ???",
                        female : "Vous avez vraiment donné votre numéro de téléphone ???"
                    },
                    {
                        male : "Vous pensez vraiment donner suite à la rencontre précédente ?",
                        female : "Vous pensez vraiment donner suite à la rencontre précédente ?"
                    },
                    {
                        male : "C'est plus facile que dans la vraie vie, hein ?",
                        female : "C'est plus facile que dans la vraie vie, hein ?"
                    },
                    {
                        male : "C'est parti pour le zapping ?",
                        female : "C'est parti pour le zapping ?"
                    },
                    {
                        male : "Vous ne deviendriez pas trop exigeant ?",
                        female : "Vous ne deviendriez pas trop exigeante ?"
                    },
                    {
                        male : "Vous cherchez vraiment à rencontrer quelqu'un ?",
                        female : "Vous cherchez vraiment à rencontrer quelqu'un ?"
                    },
                    {
                        male : "On se sent en confiance on dirait...",
                        female : "On se sent en confiance on dirait..."
                    },
                    {
                        male : "On y prend goût...",
                        female : "On y prend goût..."
                    },
                    {
                        male : "Vous ne seriez pas en train de devenir accro ?",
                        female : "vous ne seriez pas en train de devenir accro ?"
                    },
                    {
                        male : "A trop chercher le jackpot, vous risquez de tout perdre...",
                        female : "A trop chercher le jackpot, vous risquez de tout perdre..."
                    }
                ]
            };

						this.warningsFailure = {
                'en' : [
                    {
                        male : "We can not guarantee that your repeated attempts will remain confidential.",
                        female : "We can not guarantee that your repeated attempts will remain confidential."
                    },
                    {
                        male : "Women can be complicated...",
                        female : "Men can be complicated..."
                    },
                ],
                'fr' : [
                    {
                        male : "Nous ne pouvons pas vous garantir que vos tentatives réitérées resteront confidentielles.",
                        female : "Nous ne pouvons pas vous garantir que vos tentatives réitérées resteront confidentielles."
                    },
										{
                        male : "Les femmes peuvent être compliquées...",
                        female : "Les hommes peuvent être compliqués..."
                    },
                    {
                        male : "Ne voulez vous pas prendre quelques minutes avant de rencontrer une nouvelle personne ?",
                        female : "Ne voulez vous pas prendre quelques minutes avant de rencontrer une nouvelle personne ?"
                    },
                    {
                        male : "Vous avez raison, il ne faut pas rester sur un échec.",
                        female : "Vous avez raison, il ne faut pas rester sur un échec."
                    },
                    {
                        male : "Bonne chance cette fois ! Il faut y croire !",
                        female : "Bonne chance cette fois ! Il faut y croire !"
                    },
                    {
                        male : "Vous avez raison de ne pas vous décourager.",
                        female : "Vous avez raison de ne pas vous décourager."
                    },
                    {
                        male : "Cette fois sera peut-être la bonne, vous êtes prêt ?",
                        female : "Cette fois sera peut-être la bonne, vous êtes prête ?"
                    },
                    {
                        male : "Vous avez raison de continuer à chercher : le grand amour est là quelque part...",
                        female : "Vous avez raison de continuer à chercher : le grand amour est là quelque part..."
                    },
                    {
                        male : "Allez, on ne baisse pas les bras, on y croit !",
                        female : "Allez, on ne baisse pas les bras, on y croit !"
                    },
                    {
                        male : "Bravo ! Quand on ne peut pas revenir en arrière, il faut aller de l'avant !",
                        female : "Bravo ! Quand on ne peut pas revenir en arrière, il faut aller de l'avant !"
                    },
                    {
                        male : "L'échec n'est qu'une opportunité de recommencer ! Courage !",
                        female : "L'échec n'est qu'une opportunité de recommencer ! Courage !"
                    },
                    {
                        male : "On y croit cette fois.",
                        female : "On y croit cette fois."
                    },
                    {
                        male : "Essayez d'être vous même cette fois !",
                        female : "Essayez d'être vous même cette fois !"
                    },
                    {
                        male : "Ne cherchez pas à cacher qui vous êtes vraiment. Tout se voit !",
                        female : "Ne cherchez pas à cacher qui vous êtes vraiment. Tout se voit !"
                    },
                ]
            };

            this.naughtyWarning = async function(exit_code){
							let myLangWarnings;
								if( exit_code == 0 )
								{ // If the discussion was successful
									myLangWarnings = this.warningsSuccess[$translate.use()];
								}
								else
								{
									myLangWarnings = this.warningsFailure[$translate.use()];
								}
                message = myLangWarnings[Math.floor(Math.random()*myLangWarnings.length)]
                message = userInfoService.getGender()=='m'? message.male : message.female;
								// Handle the case where the user is gay for gendered messages
								if( userInfoService.getPreferredGender() == userInfoService.getGender() ){
										if( message == "Women can be complicated...") { message = "Men can be complicated..."; }
										else if( message == "Men can be complicated...") { message = "Woman can be complicated..."; }
								}
                return await this.warning(message);
            }

            this.warning = async function(message){
                try{
                    await $mdDialog.show({
                        controller: ['$scope',
                            function dialogController($scope){
                                $scope.message = message
                                $scope.continue = function(){
                                    $mdDialog.hide();
                                }
                                //Hack to refresh every 150ms
                                let continuousRefresh = function(){
                                    setTimeout(function(){
                                        if(!$scope.$$phase){
                                            $scope.$digest();
                                        }
                                        continuousRefresh();
                                    },150)
                                }
                                continuousRefresh();
                                }
                        ],
                        templateUrl: 'app/dialog/naughty-boy.template.html',
                        parent: angular.element(document.body)
                    });
                    return true;
                }catch(error){
                    if(error)
                        console.error(error)
                    //An undefined error is thrown on close
                    return false;
                }

            }
        }]);
