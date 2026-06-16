-- Update existing wealth income goal target to Rp25M/month
update goals
set
  target_value = 25000000,
  description = 'Rp25M/month target',
  updated_at = now()
where category = 'wealth'
  and title = 'Monthly Income'
  and target_value = 300000000;
