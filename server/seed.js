Meteor.startup(function () {
  if (Phones.findOne({})) return;
  console.log('Seeding phone database');
  var phones = JSON.parse(Assets.getText('phones/phones.json'));
  for (var i = 0; i < phones.length; i++) {
    var phone = JSON.parse(Assets.getText('phones/' + phones[i].id + '.json'));
    Phones.insert(_.extend(phone, phones[i]));
  };
});