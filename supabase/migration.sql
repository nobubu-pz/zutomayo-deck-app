-- Add is_public and last_viewed_friends_at columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public boolean default true not null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_viewed_friends_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Update RLS policy on user_cards so that friends can only view if is_public is true
DROP POLICY IF EXISTS "Users can view friends cards" ON public.user_cards;

CREATE POLICY "Users can view friends cards" ON public.user_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.friendships f
      WHERE (f.sender_id = auth.uid() AND f.receiver_id = user_cards.user_id AND f.status = 'accepted')
         OR (f.receiver_id = auth.uid() AND f.sender_id = user_cards.user_id AND f.status = 'accepted')
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_cards.user_id AND p.is_public = true
    )
  );
