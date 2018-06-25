//This service stores the user informations so that they can be retrieved in the whole application
angular.module('storyface')
	.filter('emoji', function(){
				return function(emotion, size){
					if(!size)
						size=32;
					let icon_name;

					switch(emotion){
						case 'happiness':
							icon_name='happiness.png';
						break;
						case 'anger':
							icon_name='anger.png';
						break;
						case 'disgust':
							icon_name='disgust.png';
						break;
						case 'fear':
							icon_name='fear.png';
						break;
						case 'sadness':
							icon_name='sadness.png';
						break;
						case 'surprise':
							icon_name='surprise.png';
						break;
						case 'neutral' :
							return '';
						break;
						default:
							//console.error('unknown emoji : '+emotion);
							return '';

					}
					return '<img src="/storyface/images/emojis/'+icon_name+'" class="emoji" width="'+size+'" height="'+size+'" alt="'+emotion+'" />'

				}
			}
);

