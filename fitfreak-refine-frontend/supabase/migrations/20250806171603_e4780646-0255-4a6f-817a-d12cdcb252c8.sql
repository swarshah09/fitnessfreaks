-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  goal TEXT CHECK (goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'endurance')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weight tracking table
CREATE TABLE public.weight_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create height tracking table  
CREATE TABLE public.height_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  height DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- in minutes
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sets INTEGER,
  reps INTEGER,
  duration INTEGER, -- in seconds
  rest_time INTEGER, -- in seconds
  instructions TEXT,
  muscle_groups TEXT[],
  equipment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user workout sessions table
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('started', 'completed', 'paused')) DEFAULT 'started',
  notes TEXT,
  calories_burned INTEGER
);

-- Create nutrition/food table
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  calories_per_100g INTEGER NOT NULL,
  protein_per_100g DECIMAL(5,2),
  carbs_per_100g DECIMAL(5,2),
  fat_per_100g DECIMAL(5,2),
  fiber_per_100g DECIMAL(5,2),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user food diary table
CREATE TABLE public.food_diary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  quantity DECIMAL(8,2) NOT NULL, -- in grams
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.height_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_diary ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for weight_history
CREATE POLICY "Users can view their own weight history" ON public.weight_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight records" ON public.weight_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight records" ON public.weight_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for height_history
CREATE POLICY "Users can view their own height history" ON public.height_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own height records" ON public.height_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own height records" ON public.height_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for workouts (public read, admin write)
CREATE POLICY "Workouts are viewable by everyone" ON public.workouts
  FOR SELECT USING (true);

-- Create RLS Policies for exercises (public read)
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
  FOR SELECT USING (true);

-- Create RLS Policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions" ON public.workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" ON public.workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" ON public.workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS Policies for foods (public read)
CREATE POLICY "Foods are viewable by everyone" ON public.foods
  FOR SELECT USING (true);

-- Create RLS Policies for food_diary
CREATE POLICY "Users can view their own food diary" ON public.food_diary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food diary entries" ON public.food_diary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food diary entries" ON public.food_diary
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food diary entries" ON public.food_diary
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample workout data
INSERT INTO public.workouts (name, description, duration, difficulty_level, category, image_url) VALUES
  ('Full Body Strength', 'A comprehensive strength training workout targeting all major muscle groups', 45, 'intermediate', 'strength', '/images/full-body-strength.jpg'),
  ('HIIT Cardio Blast', 'High-intensity interval training for maximum calorie burn', 30, 'advanced', 'cardio', '/images/hiit-cardio.jpg'),
  ('Beginner Yoga Flow', 'Gentle yoga sequence perfect for beginners', 20, 'beginner', 'flexibility', '/images/yoga-flow.jpg'),
  ('Core Power', 'Intense core strengthening workout', 25, 'intermediate', 'core', '/images/core-power.jpg');

-- Insert sample exercises for Full Body Strength workout
INSERT INTO public.exercises (workout_id, name, description, sets, reps, instructions, muscle_groups, equipment) VALUES
  ((SELECT id FROM public.workouts WHERE name = 'Full Body Strength'), 'Push-ups', 'Classic bodyweight chest exercise', 3, 12, 'Start in plank position, lower chest to ground, push back up', ARRAY['chest', 'triceps', 'shoulders'], 'none'),
  ((SELECT id FROM public.workouts WHERE name = 'Full Body Strength'), 'Squats', 'Fundamental lower body exercise', 3, 15, 'Stand with feet shoulder-width apart, lower into sitting position, return to standing', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'none'),
  ((SELECT id FROM public.workouts WHERE name = 'Full Body Strength'), 'Plank', 'Core stability exercise', 3, 30, 'Hold plank position for specified duration', ARRAY['core', 'shoulders'], 'none');

-- Insert sample food data
INSERT INTO public.foods (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, category) VALUES
  ('Chicken Breast', 165, 31.0, 0.0, 3.6, 0.0, 'protein'),
  ('Brown Rice', 123, 2.6, 23.0, 0.9, 1.8, 'grains'),
  ('Broccoli', 34, 2.8, 7.0, 0.4, 2.6, 'vegetables'),
  ('Banana', 89, 1.1, 23.0, 0.3, 2.6, 'fruits'),
  ('Almonds', 579, 21.0, 22.0, 50.0, 12.0, 'nuts'),
  ('Greek Yogurt', 59, 10.0, 3.6, 0.4, 0.0, 'dairy');