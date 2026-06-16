insert into identity_manifesto (
  id,
  identity_statement,
  fear_of_drift,
  age_35_vision,
  life_principles
) values (
  1,
  'I am a builder who refuses to drift.',
  E'At 38: no wife, no kids, money gone, nothing built.',
  E'Multiple businesses
Hundreds of millions per month
Safe and sound marriage
One child
Scratch golfer
Healthy body
Builder of meaningful things',
  E'Drift destroys lives.
Systems beat motivation.
Builders debug systems.
Identity drives behavior.
Small actions compound.'
) on conflict (id) do nothing;

insert into goals (category, title, target_value, current_value, unit, description) values
  ('wealth', 'Monthly Income', 300000000, 0, 'IDR/month', 'Rp300,000,000/month target'),
  ('golf', 'Handicap Goal', 0, 18, 'handicap', 'Scratch handicap target')
on conflict do nothing;
