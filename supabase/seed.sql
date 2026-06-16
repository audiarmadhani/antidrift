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
  ('wealth', 'Monthly Income', 25000000, 0, 'IDR/month', 'Rp25M/month target'),
  ('business', 'Ship MVP', 1, 0, 'projects', 'Launch first product version'),
  ('marriage', 'Weekly Date Night', 4, 0, 'dates/month', 'Four intentional dates per month'),
  ('health', 'Train Consistently', 4, 0, 'sessions/week', 'Four workouts per week'),
  ('golf', 'Scratch Handicap', 0, 18, 'handicap', 'Work from 18 to scratch'),
  ('character', '30-Day Honesty Streak', 30, 0, 'days', 'No secret behavior for 30 days')
on conflict do nothing;
