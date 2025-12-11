// Exercise data organized by muscle groups
// Media URLs can be sourced from gymvisual.com

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sets: {
    beginner: { min: number; max: number };
    intermediate: { min: number; max: number };
    advanced: { min: number; max: number };
  };
  reps: {
    beginner: { min: number; max: number };
    intermediate: { min: number; max: number };
    advanced: { min: number; max: number };
  };
  safetyTips: string[];
  instructions: string[];
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: Exercise[];
}

export const exercisesByMuscleGroup: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Chest',
    exercises: [
      {
        id: 'push-up',
        name: 'Push-Up',
        description: 'Classic bodyweight exercise targeting the chest, shoulders, and triceps.',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 12 },
          intermediate: { min: 12, max: 20 },
          advanced: { min: 20, max: 30 }
        },
        safetyTips: [
          'Keep your core tight and back straight throughout the movement',
          'Lower your body until your chest nearly touches the floor',
          'Avoid arching your back or letting your hips sag',
          'Breathe out as you push up, breathe in as you lower down'
        ],
        instructions: [
          'Start in plank position with hands slightly wider than shoulders',
          'Lower your body until chest is close to the ground',
          'Push back up to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/2/3/123.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/2/3/123.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/2/3/123.mp4'
      },
      {
        id: 'bench-press',
        name: 'Bench Press',
        description: 'Compound exercise primarily targeting the pectoral muscles.',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'Barbell, Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 5, max: 6 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 6, max: 8 },
          advanced: { min: 4, max: 6 }
        },
        safetyTips: [
          'Always use a spotter when lifting heavy weights',
          'Keep your feet flat on the floor for stability',
          'Don\'t bounce the bar off your chest',
          'Control the weight on both the way down and up'
        ],
        instructions: [
          'Lie on bench with eyes under the bar',
          'Grip bar slightly wider than shoulder width',
          'Lower bar to chest with control',
          'Press bar up until arms are fully extended',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/3/4/234.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/3/4/234.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/3/4/234.mp4'
      },
      {
        id: 'dumbbell-fly',
        name: 'Dumbbell Fly',
        description: 'Isolation exercise that targets the pectoral muscles.',
        muscleGroups: ['Chest'],
        equipment: 'Dumbbells, Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Don\'t use too much weight - focus on form',
          'Keep a slight bend in your elbows throughout',
          'Control the movement - don\'t let gravity do the work',
          'Stop before your arms are fully extended'
        ],
        instructions: [
          'Lie on bench holding dumbbells above chest',
          'Lower weights in wide arc until chest stretch is felt',
          'Bring weights back together above chest',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/3/4/5/345.jpg',
        gifUrl: 'https://gymvisual.com/img/p/3/4/5/345.gif',
        videoUrl: 'https://gymvisual.com/img/p/3/4/5/345.mp4'
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        description: 'Targets the upper portion of the pectoral muscles.',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'Dumbbells, Incline Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Set bench to 30-45 degree angle',
          'Keep feet flat on floor',
          'Control the weight throughout the movement',
          'Don\'t lock out elbows at the top'
        ],
        instructions: [
          'Sit on incline bench with dumbbells at shoulder level',
          'Press weights up until arms are extended',
          'Lower weights back to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/5/6/456.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/5/6/456.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/5/6/456.mp4'
      },
      {
        id: 'decline-bench-press',
        name: 'Decline Bench Press',
        description: 'Targets the lower portion of the pectoral muscles.',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'Barbell, Decline Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Always use safety bars or a spotter',
          'Keep your feet secured in the foot pads',
          'Control the weight throughout',
          'Don\'t let the bar drift toward your neck'
        ],
        instructions: [
          'Secure yourself on decline bench',
          'Grip bar slightly wider than shoulder width',
          'Lower bar to lower chest with control',
          'Press bar up until arms are fully extended',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/6/7/567.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/6/7/567.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/6/7/567.mp4'
      },
      {
        id: 'cable-crossover',
        name: 'Cable Crossover',
        description: 'Isolation exercise using cables to target the chest muscles.',
        muscleGroups: ['Chest'],
        equipment: 'Cable Machine',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep a slight bend in your elbows',
          'Control the weight - don\'t let it pull you forward',
          'Squeeze your chest at the bottom of the movement',
          'Maintain proper posture throughout'
        ],
        instructions: [
          'Set cables to high position',
          'Stand in center with one foot forward',
          'Pull cables down and across your body',
          'Squeeze chest muscles at the bottom',
          'Return to starting position with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/7/8/678.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/7/8/678.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/7/8/678.mp4'
      },
      {
        id: 'chest-dips',
        name: 'Chest Dips',
        description: 'Advanced bodyweight exercise targeting the lower chest and triceps.',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        equipment: 'Dip Bars',
        difficulty: 'advanced',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 5, max: 8 },
          intermediate: { min: 8, max: 12 },
          advanced: { min: 12, max: 20 }
        },
        safetyTips: [
          'Lean forward to target chest more',
          'Don\'t go too low if you feel shoulder strain',
          'Keep your core engaged',
          'Control the movement throughout'
        ],
        instructions: [
          'Grip dip bars with palms facing in',
          'Lean forward slightly',
          'Lower body by bending arms',
          'Push back up to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/7/8/9/789.jpg',
        gifUrl: 'https://gymvisual.com/img/p/7/8/9/789.gif',
        videoUrl: 'https://gymvisual.com/img/p/7/8/9/789.mp4'
      }
    ]
  },
  {
    id: 'abs',
    name: 'Abs',
    exercises: [
      {
        id: 'crunch',
        name: 'Crunch',
        description: 'Basic abdominal exercise targeting the rectus abdominis.',
        muscleGroups: ['Abs'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 15 },
          intermediate: { min: 15, max: 25 },
          advanced: { min: 25, max: 35 }
        },
        safetyTips: [
          'Don\'t pull on your neck with your hands',
          'Keep your lower back on the floor',
          'Exhale as you crunch up',
          'Move slowly and with control'
        ],
        instructions: [
          'Lie on back with knees bent and feet flat',
          'Place hands behind head or across chest',
          'Lift shoulders off ground, crunching abs',
          'Lower back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/1/111.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/1/111.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/1/111.mp4'
      },
      {
        id: 'plank',
        name: 'Plank',
        description: 'Isometric exercise that strengthens the entire core.',
        muscleGroups: ['Abs', 'Core'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 20, max: 30 }, // seconds
          intermediate: { min: 30, max: 60 },
          advanced: { min: 60, max: 120 }
        },
        safetyTips: [
          'Keep your body in a straight line',
          'Don\'t let your hips sag or rise',
          'Engage your core throughout',
          'Breathe normally'
        ],
        instructions: [
          'Start in push-up position',
          'Lower to forearms, keeping body straight',
          'Hold position for desired time',
          'Keep core engaged throughout'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/2/112.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/2/112.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/2/112.mp4'
      },
      {
        id: 'leg-raise',
        name: 'Leg Raise',
        description: 'Targets the lower abdominals and hip flexors.',
        muscleGroups: ['Abs', 'Hip Flexors'],
        equipment: 'Bodyweight, Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 15 },
          intermediate: { min: 15, max: 20 },
          advanced: { min: 20, max: 25 }
        },
        safetyTips: [
          'Keep your lower back pressed to the floor',
          'Control the movement - don\'t swing your legs',
          'Lower legs slowly',
          'Stop if you feel lower back strain'
        ],
        instructions: [
          'Lie flat on back with hands under glutes',
          'Lift legs straight up until perpendicular to floor',
          'Lower legs slowly back down',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/3/113.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/3/113.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/3/113.mp4'
      },
      {
        id: 'russian-twist',
        name: 'Russian Twist',
        description: 'Rotational core exercise targeting the obliques.',
        muscleGroups: ['Abs', 'Obliques'],
        equipment: 'Bodyweight, Optional: Medicine Ball',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 15 },
          intermediate: { min: 15, max: 20 },
          advanced: { min: 20, max: 30 }
        },
        safetyTips: [
          'Keep your back straight',
          'Rotate from your core, not your arms',
          'Don\'t lean back too far',
          'Move in a controlled manner'
        ],
        instructions: [
          'Sit with knees bent, lean back slightly',
          'Hold weight or clasp hands together',
          'Rotate torso from side to side',
          'Keep core engaged throughout',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/4/114.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/4/114.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/4/114.mp4'
      },
      {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        description: 'Dynamic core exercise that also improves cardiovascular fitness.',
        muscleGroups: ['Abs', 'Core', 'Shoulders'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 15 },
          intermediate: { min: 20, max: 30 },
          advanced: { min: 30, max: 40 }
        },
        safetyTips: [
          'Keep your core engaged throughout',
          'Maintain a straight line from head to heels',
          'Don\'t let your hips rise too high',
          'Move at a controlled pace'
        ],
        instructions: [
          'Start in plank position',
          'Bring one knee toward your chest',
          'Quickly switch legs',
          'Continue alternating legs',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/5/115.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/5/115.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/5/115.mp4'
      },
      {
        id: 'bicycle-crunch',
        name: 'Bicycle Crunch',
        description: 'Targets the rectus abdominis and obliques with a cycling motion.',
        muscleGroups: ['Abs', 'Obliques'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 15 },
          intermediate: { min: 20, max: 30 },
          advanced: { min: 30, max: 40 }
        },
        safetyTips: [
          'Keep your lower back on the floor',
          'Don\'t pull on your neck',
          'Move in a controlled, steady rhythm',
          'Focus on bringing your elbow to opposite knee'
        ],
        instructions: [
          'Lie on back with hands behind head',
          'Bring knees up to 90 degrees',
          'Alternate bringing opposite elbow to opposite knee',
          'Continue cycling motion',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/6/116.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/6/116.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/6/116.mp4'
      },
      {
        id: 'hanging-leg-raise',
        name: 'Hanging Leg Raise',
        description: 'Advanced exercise targeting the lower abs while hanging from a bar.',
        muscleGroups: ['Abs', 'Hip Flexors'],
        equipment: 'Pull-up Bar',
        difficulty: 'advanced',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 5, max: 8 },
          intermediate: { min: 8, max: 12 },
          advanced: { min: 12, max: 20 }
        },
        safetyTips: [
          'Keep your core engaged throughout',
          'Control the movement - don\'t swing',
          'Don\'t use momentum',
          'Stop if you feel lower back strain'
        ],
        instructions: [
          'Hang from pull-up bar with arms fully extended',
          'Raise legs up toward your chest',
          'Lower legs back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/1/1/7/117.jpg',
        gifUrl: 'https://gymvisual.com/img/p/1/1/7/117.gif',
        videoUrl: 'https://gymvisual.com/img/p/1/1/7/117.mp4'
      }
    ]
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    exercises: [
      {
        id: 'shoulder-press',
        name: 'Shoulder Press',
        description: 'Compound exercise targeting the deltoid muscles.',
        muscleGroups: ['Shoulders', 'Triceps'],
        equipment: 'Dumbbells or Barbell',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Keep your core tight',
          'Don\'t arch your back excessively',
          'Control the weight throughout',
          'Start with lighter weight to perfect form'
        ],
        instructions: [
          'Stand or sit with weights at shoulder level',
          'Press weights straight up overhead',
          'Lower weights back to shoulder level',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/1/1/211.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/1/1/211.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/1/1/211.mp4'
      },
      {
        id: 'lateral-raise',
        name: 'Lateral Raise',
        description: 'Isolation exercise targeting the lateral deltoids.',
        muscleGroups: ['Shoulders'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Use lighter weights - form is more important',
          'Keep a slight bend in your elbows',
          'Raise to shoulder height, not higher',
          'Control the negative movement'
        ],
        instructions: [
          'Stand holding dumbbells at your sides',
          'Raise weights out to sides until shoulder height',
          'Lower weights back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/1/2/212.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/1/2/212.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/1/2/212.mp4'
      },
      {
        id: 'front-raise',
        name: 'Front Raise',
        description: 'Targets the anterior deltoid muscles.',
        muscleGroups: ['Shoulders'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your core engaged',
          'Don\'t swing the weights',
          'Control the movement',
          'Stop at shoulder height'
        ],
        instructions: [
          'Stand holding dumbbells in front of thighs',
          'Raise weights forward to shoulder height',
          'Lower weights back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/1/3/213.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/1/3/213.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/1/3/213.mp4'
      },
      {
        id: 'rear-delt-fly',
        name: 'Rear Delt Fly',
        description: 'Targets the posterior deltoids and upper back.',
        muscleGroups: ['Shoulders', 'Back'],
        equipment: 'Dumbbells or Cable Machine',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Use lighter weights',
          'Keep a slight bend in your elbows',
          'Squeeze your shoulder blades together',
          'Control the movement throughout'
        ],
        instructions: [
          'Bend forward with slight knee bend',
          'Hold dumbbells with arms extended',
          'Raise weights out to sides',
          'Squeeze rear delts at the top',
          'Lower weights back down',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/1/4/214.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/1/4/214.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/1/4/214.mp4'
      },
      {
        id: 'arnold-press',
        name: 'Arnold Press',
        description: 'Rotational shoulder press targeting all three deltoid heads.',
        muscleGroups: ['Shoulders', 'Triceps'],
        equipment: 'Dumbbells',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Start with lighter weights',
          'Control the rotation',
          'Keep your core engaged',
          'Don\'t arch your back'
        ],
        instructions: [
          'Start with palms facing you, weights at shoulder level',
          'Press up while rotating palms forward',
          'At the top, palms should face forward',
          'Lower weights while rotating back',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/2/1/5/215.jpg',
        gifUrl: 'https://gymvisual.com/img/p/2/1/5/215.gif',
        videoUrl: 'https://gymvisual.com/img/p/2/1/5/215.mp4'
      }
    ]
  },
  {
    id: 'biceps',
    name: 'Biceps',
    exercises: [
      {
        id: 'bicep-curl',
        name: 'Bicep Curl',
        description: 'Classic isolation exercise targeting the biceps brachii.',
        muscleGroups: ['Biceps'],
        equipment: 'Dumbbells or Barbell',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbows stationary',
          'Don\'t swing the weights',
          'Control the negative movement',
          'Keep your back straight'
        ],
        instructions: [
          'Stand holding weights at your sides',
          'Curl weights up by bending elbows',
          'Squeeze biceps at the top',
          'Lower weights back down slowly',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/3/1/1/311.jpg',
        gifUrl: 'https://gymvisual.com/img/p/3/1/1/311.gif',
        videoUrl: 'https://gymvisual.com/img/p/3/1/1/311.mp4'
      },
      {
        id: 'hammer-curl',
        name: 'Hammer Curl',
        description: 'Targets biceps and brachialis with neutral grip.',
        muscleGroups: ['Biceps', 'Brachialis'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep palms facing each other',
          'Control the movement',
          'Don\'t use momentum',
          'Keep elbows close to body'
        ],
        instructions: [
          'Hold dumbbells with neutral grip (palms facing in)',
          'Curl weights up by bending elbows',
          'Lower weights back down slowly',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/3/1/2/312.jpg',
        gifUrl: 'https://gymvisual.com/img/p/3/1/2/312.gif',
        videoUrl: 'https://gymvisual.com/img/p/3/1/2/312.mp4'
      },
      {
        id: 'concentration-curl',
        name: 'Concentration Curl',
        description: 'Isolation exercise targeting the biceps with focused movement.',
        muscleGroups: ['Biceps'],
        equipment: 'Dumbbell',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbow stationary',
          'Don\'t swing the weight',
          'Control the negative movement',
          'Focus on the muscle contraction'
        ],
        instructions: [
          'Sit on bench with legs spread',
          'Rest elbow on inner thigh',
          'Curl weight up by bending elbow',
          'Squeeze bicep at the top',
          'Lower weight back down slowly',
          'Repeat for desired number of reps, then switch arms'
        ],
        imageUrl: 'https://gymvisual.com/img/p/3/1/3/313.jpg',
        gifUrl: 'https://gymvisual.com/img/p/3/1/3/313.gif',
        videoUrl: 'https://gymvisual.com/img/p/3/1/3/313.mp4'
      },
      {
        id: 'cable-curl',
        name: 'Cable Curl',
        description: 'Constant tension bicep exercise using cable machine.',
        muscleGroups: ['Biceps'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbows stationary',
          'Control the weight throughout',
          'Don\'t use momentum',
          'Maintain proper posture'
        ],
        instructions: [
          'Stand facing cable machine',
          'Grip cable attachment with underhand grip',
          'Curl weight up by bending elbows',
          'Squeeze biceps at the top',
          'Lower weight back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/3/1/4/314.jpg',
        gifUrl: 'https://gymvisual.com/img/p/3/1/4/314.gif',
        videoUrl: 'https://gymvisual.com/img/p/3/1/4/314.mp4'
      }
    ]
  },
  {
    id: 'triceps',
    name: 'Triceps',
    exercises: [
      {
        id: 'tricep-dip',
        name: 'Tricep Dip',
        description: 'Bodyweight exercise targeting the triceps and shoulders.',
        muscleGroups: ['Triceps', 'Shoulders'],
        equipment: 'Bodyweight, Bench or Chair',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbows close to your body',
          'Don\'t go too low if you feel shoulder strain',
          'Keep your body upright',
          'Control the movement'
        ],
        instructions: [
          'Sit on edge of bench with hands gripping edge',
          'Slide forward off bench',
          'Lower body by bending elbows',
          'Push back up to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/1/1/411.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/1/1/411.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/1/1/411.mp4'
      },
      {
        id: 'overhead-tricep-extension',
        name: 'Overhead Tricep Extension',
        description: 'Isolation exercise targeting the triceps.',
        muscleGroups: ['Triceps'],
        equipment: 'Dumbbell',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbows pointing forward',
          'Don\'t let your elbows flare out',
          'Control the weight',
          'Keep your core engaged'
        ],
        instructions: [
          'Hold dumbbell overhead with both hands',
          'Lower weight behind head by bending elbows',
          'Extend arms back up overhead',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/1/2/412.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/1/2/412.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/1/2/412.mp4'
      },
      {
        id: 'tricep-kickback',
        name: 'Tricep Kickback',
        description: 'Isolation exercise targeting the triceps with bent-over position.',
        muscleGroups: ['Triceps'],
        equipment: 'Dumbbell',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your back straight',
          'Keep your elbow stationary',
          'Control the movement',
          'Don\'t swing the weight'
        ],
        instructions: [
          'Bend over with one hand on bench for support',
          'Hold dumbbell with arm bent at 90 degrees',
          'Extend arm back until straight',
          'Squeeze tricep at the top',
          'Lower weight back to starting position',
          'Repeat for desired number of reps, then switch arms'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/1/3/413.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/1/3/413.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/1/3/413.mp4'
      },
      {
        id: 'close-grip-bench-press',
        name: 'Close-Grip Bench Press',
        description: 'Compound exercise targeting triceps with emphasis on chest.',
        muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
        equipment: 'Barbell, Bench',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Use a spotter for heavy weights',
          'Keep elbows close to body',
          'Control the weight',
          'Don\'t let wrists bend backward'
        ],
        instructions: [
          'Lie on bench with hands closer than shoulder width',
          'Lower bar to chest with control',
          'Press bar up until arms are extended',
          'Keep elbows close to body throughout',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/1/4/414.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/1/4/414.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/1/4/414.mp4'
      },
      {
        id: 'cable-tricep-extension',
        name: 'Cable Tricep Extension',
        description: 'Constant tension tricep exercise using cable machine.',
        muscleGroups: ['Triceps'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your elbows stationary',
          'Control the weight',
          'Don\'t use momentum',
          'Keep your core engaged'
        ],
        instructions: [
          'Stand facing away from cable machine',
          'Grip cable attachment with overhand grip',
          'Extend arms down until straight',
          'Squeeze triceps at the bottom',
          'Return to starting position with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/4/1/5/415.jpg',
        gifUrl: 'https://gymvisual.com/img/p/4/1/5/415.gif',
        videoUrl: 'https://gymvisual.com/img/p/4/1/5/415.mp4'
      }
    ]
  },
  {
    id: 'back',
    name: 'Back',
    exercises: [
      {
        id: 'pull-up',
        name: 'Pull-Up',
        description: 'Compound exercise targeting the latissimus dorsi and biceps.',
        muscleGroups: ['Back', 'Biceps'],
        equipment: 'Pull-up Bar',
        difficulty: 'advanced',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 3, max: 5 },
          intermediate: { min: 6, max: 10 },
          advanced: { min: 10, max: 15 }
        },
        safetyTips: [
          'Use full range of motion',
          'Control the negative movement',
          'Don\'t swing or kip',
          'Engage your core'
        ],
        instructions: [
          'Hang from bar with palms facing away',
          'Pull body up until chin is over bar',
          'Lower body back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/1/511.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/1/511.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/1/511.mp4'
      },
      {
        id: 'bent-over-row',
        name: 'Bent-Over Row',
        description: 'Compound exercise targeting the middle and upper back.',
        muscleGroups: ['Back', 'Biceps'],
        equipment: 'Barbell or Dumbbells',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Keep your back straight',
          'Don\'t round your spine',
          'Pull to your lower chest/upper abs',
          'Keep your core engaged'
        ],
        instructions: [
          'Bend over with slight knee bend',
          'Pull weight to lower chest/upper abs',
          'Squeeze shoulder blades together',
          'Lower weight back down',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/2/512.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/2/512.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/2/512.mp4'
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        description: 'Machine exercise targeting the latissimus dorsi.',
        muscleGroups: ['Back', 'Biceps'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Pull to your chest, not behind your head',
          'Keep your core engaged',
          'Control the weight',
          'Don\'t lean back too far'
        ],
        instructions: [
          'Sit at lat pulldown machine',
          'Grip bar wider than shoulder width',
          'Pull bar down to upper chest',
          'Slowly return to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/3/513.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/3/513.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/3/513.mp4'
      },
      {
        id: 'seated-row',
        name: 'Seated Cable Row',
        description: 'Machine exercise targeting the middle back and rhomboids.',
        muscleGroups: ['Back', 'Biceps', 'Rhomboids'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your back straight',
          'Don\'t round your shoulders',
          'Pull to your lower chest/upper abs',
          'Squeeze shoulder blades together'
        ],
        instructions: [
          'Sit at cable row machine',
          'Grip handle with both hands',
          'Pull handle to lower chest/upper abs',
          'Squeeze shoulder blades together',
          'Return to starting position with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/4/514.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/4/514.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/4/514.mp4'
      },
      {
        id: 't-bar-row',
        name: 'T-Bar Row',
        description: 'Compound exercise targeting the middle and upper back.',
        muscleGroups: ['Back', 'Biceps', 'Rhomboids'],
        equipment: 'T-Bar Machine or Barbell',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Keep your back straight',
          'Don\'t round your spine',
          'Control the weight',
          'Keep your core engaged'
        ],
        instructions: [
          'Straddle T-bar with feet on platform',
          'Bend over and grip handle',
          'Pull weight to your chest',
          'Squeeze shoulder blades together',
          'Lower weight back down',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/5/515.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/5/515.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/5/515.mp4'
      },
      {
        id: 'face-pull',
        name: 'Face Pull',
        description: 'Targets the rear deltoids and upper back muscles.',
        muscleGroups: ['Back', 'Shoulders', 'Rhomboids'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 12, max: 15 },
          intermediate: { min: 15, max: 20 },
          advanced: { min: 20, max: 25 }
        },
        safetyTips: [
          'Use lighter weight',
          'Pull to your face level',
          'Squeeze rear delts and upper back',
          'Control the movement'
        ],
        instructions: [
          'Set cable to face height',
          'Grip rope attachment with overhand grip',
          'Pull rope to your face, splitting it apart',
          'Squeeze rear delts and upper back',
          'Return to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/5/1/6/516.jpg',
        gifUrl: 'https://gymvisual.com/img/p/5/1/6/516.gif',
        videoUrl: 'https://gymvisual.com/img/p/5/1/6/516.mp4'
      }
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    exercises: [
      {
        id: 'squat',
        name: 'Squat',
        description: 'Fundamental compound exercise targeting the quadriceps, glutes, and hamstrings.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: 'Bodyweight or Barbell',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your knees in line with your toes',
          'Don\'t let your knees cave inward',
          'Keep your chest up and back straight',
          'Go down until thighs are parallel to floor'
        ],
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower body by bending knees and hips',
          'Go down until thighs are parallel to floor',
          'Push back up to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/1/611.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/1/611.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/1/611.mp4'
      },
      {
        id: 'deadlift',
        name: 'Deadlift',
        description: 'Compound exercise targeting the posterior chain including hamstrings, glutes, and back.',
        muscleGroups: ['Hamstrings', 'Glutes', 'Back'],
        equipment: 'Barbell',
        difficulty: 'advanced',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 5, max: 8 },
          intermediate: { min: 8, max: 10 },
          advanced: { min: 10, max: 12 }
        },
        safetyTips: [
          'Keep your back straight throughout',
          'Don\'t round your spine',
          'Keep the bar close to your body',
          'Engage your core and glutes'
        ],
        instructions: [
          'Stand with feet hip-width apart, bar over mid-foot',
          'Bend at hips and knees to grip bar',
          'Keep back straight, chest up',
          'Lift bar by extending hips and knees',
          'Lower bar back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/2/612.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/2/612.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/2/612.mp4'
      },
      {
        id: 'lunges',
        name: 'Lunges',
        description: 'Unilateral exercise targeting quadriceps, glutes, and hamstrings.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: 'Bodyweight or Dumbbells',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Keep your front knee behind your toes',
          'Don\'t let your knee cave inward',
          'Keep your torso upright',
          'Step back to starting position'
        ],
        instructions: [
          'Step forward with one leg',
          'Lower body until both knees are bent at 90 degrees',
          'Push back to starting position',
          'Repeat with other leg',
          'Alternate for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/3/613.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/3/613.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/3/613.mp4'
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        description: 'Machine exercise targeting the quadriceps, glutes, and hamstrings.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: 'Leg Press Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Don\'t lock out your knees',
          'Keep your back pressed against the pad',
          'Control the weight',
          'Use full range of motion'
        ],
        instructions: [
          'Sit in leg press machine',
          'Place feet shoulder-width apart on platform',
          'Lower weight by bending knees',
          'Press weight back up',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/4/614.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/4/614.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/4/614.mp4'
      },
      {
        id: 'leg-curl',
        name: 'Leg Curl',
        description: 'Isolation exercise targeting the hamstrings.',
        muscleGroups: ['Hamstrings'],
        equipment: 'Leg Curl Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Control the weight',
          'Don\'t use momentum',
          'Keep your hips on the pad',
          'Squeeze hamstrings at the top'
        ],
        instructions: [
          'Lie face down on leg curl machine',
          'Place ankles under pad',
          'Curl legs up by bending knees',
          'Squeeze hamstrings at the top',
          'Lower legs back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/5/615.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/5/615.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/5/615.mp4'
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        description: 'Isolation exercise targeting the quadriceps.',
        muscleGroups: ['Quadriceps'],
        equipment: 'Leg Extension Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Control the weight',
          'Don\'t lock out your knees completely',
          'Keep your back against the pad',
          'Squeeze quadriceps at the top'
        ],
        instructions: [
          'Sit in leg extension machine',
          'Place ankles under pad',
          'Extend legs up by straightening knees',
          'Squeeze quadriceps at the top',
          'Lower legs back down with control',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/6/616.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/6/616.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/6/616.mp4'
      },
      {
        id: 'calf-raise',
        name: 'Calf Raise',
        description: 'Targets the gastrocnemius and soleus muscles of the calves.',
        muscleGroups: ['Calves'],
        equipment: 'Bodyweight, Dumbbells, or Machine',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 12, max: 15 },
          intermediate: { min: 15, max: 20 },
          advanced: { min: 20, max: 25 }
        },
        safetyTips: [
          'Control the movement',
          'Go up onto your toes fully',
          'Lower down slowly',
          'Keep your core engaged'
        ],
        instructions: [
          'Stand with feet hip-width apart',
          'Rise up onto your toes',
          'Squeeze calves at the top',
          'Lower back down slowly',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/7/617.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/7/617.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/7/617.mp4'
      },
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        description: 'Hip-hinge movement targeting hamstrings and glutes.',
        muscleGroups: ['Hamstrings', 'Glutes', 'Back'],
        equipment: 'Barbell or Dumbbells',
        difficulty: 'intermediate',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Keep your back straight',
          'Don\'t round your spine',
          'Keep the weight close to your body',
          'Feel the stretch in your hamstrings'
        ],
        instructions: [
          'Stand holding weight with slight knee bend',
          'Hinge at hips, pushing hips back',
          'Lower weight down your legs',
          'Feel stretch in hamstrings',
          'Return to starting position by extending hips',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/6/1/8/618.jpg',
        gifUrl: 'https://gymvisual.com/img/p/6/1/8/618.gif',
        videoUrl: 'https://gymvisual.com/img/p/6/1/8/618.mp4'
      }
    ]
  },
  {
    id: 'abductors',
    name: 'Abductors',
    exercises: [
      {
        id: 'hip-abduction',
        name: 'Hip Abduction',
        description: 'Targets the hip abductor muscles including gluteus medius.',
        muscleGroups: ['Abductors', 'Glutes'],
        equipment: 'Cable Machine or Resistance Band',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your core engaged',
          'Don\'t lean to the side',
          'Control the movement',
          'Focus on the working leg'
        ],
        instructions: [
          'Stand with cable attached to ankle',
          'Lift leg out to the side',
          'Lower leg back down with control',
          'Repeat for desired number of reps',
          'Switch legs'
        ],
        imageUrl: 'https://gymvisual.com/img/p/7/1/1/711.jpg',
        gifUrl: 'https://gymvisual.com/img/p/7/1/1/711.gif',
        videoUrl: 'https://gymvisual.com/img/p/7/1/1/711.mp4'
      },
      {
        id: 'side-lying-hip-abduction',
        name: 'Side-Lying Hip Abduction',
        description: 'Bodyweight exercise targeting the hip abductors.',
        muscleGroups: ['Abductors'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your body in a straight line',
          'Don\'t roll forward or backward',
          'Control the movement',
          'Keep your core engaged'
        ],
        instructions: [
          'Lie on your side with legs stacked',
          'Lift top leg up and away from body',
          'Lower leg back down with control',
          'Repeat for desired number of reps',
          'Switch sides'
        ],
        imageUrl: 'https://gymvisual.com/img/p/7/1/2/712.jpg',
        gifUrl: 'https://gymvisual.com/img/p/7/1/2/712.gif',
        videoUrl: 'https://gymvisual.com/img/p/7/1/2/712.mp4'
      },
      {
        id: 'standing-hip-abduction',
        name: 'Standing Hip Abduction',
        description: 'Targets the hip abductors while standing.',
        muscleGroups: ['Abductors', 'Glutes'],
        equipment: 'Cable Machine or Resistance Band',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your core engaged',
          'Don\'t lean to the side',
          'Control the movement',
          'Hold onto something for balance if needed'
        ],
        instructions: [
          'Stand with cable attached to ankle',
          'Hold onto machine for support',
          'Lift leg out to the side',
          'Lower leg back down with control',
          'Repeat for desired number of reps',
          'Switch legs'
        ],
        imageUrl: 'https://gymvisual.com/img/p/7/1/3/713.jpg',
        gifUrl: 'https://gymvisual.com/img/p/7/1/3/713.gif',
        videoUrl: 'https://gymvisual.com/img/p/7/1/3/713.mp4'
      }
    ]
  },
  {
    id: 'adductors',
    name: 'Adductors',
    exercises: [
      {
        id: 'hip-adduction',
        name: 'Hip Adduction',
        description: 'Targets the inner thigh muscles (adductors).',
        muscleGroups: ['Adductors'],
        equipment: 'Cable Machine or Resistance Band',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your core engaged',
          'Don\'t swing your leg',
          'Control the movement',
          'Focus on the inner thigh'
        ],
        instructions: [
          'Stand with cable attached to inner ankle',
          'Pull leg across body',
          'Return leg to starting position',
          'Repeat for desired number of reps',
          'Switch legs'
        ],
        imageUrl: 'https://gymvisual.com/img/p/8/1/1/811.jpg',
        gifUrl: 'https://gymvisual.com/img/p/8/1/1/811.gif',
        videoUrl: 'https://gymvisual.com/img/p/8/1/1/811.mp4'
      },
      {
        id: 'sumo-squat',
        name: 'Sumo Squat',
        description: 'Wide-stance squat that targets the inner thighs and glutes.',
        muscleGroups: ['Adductors', 'Glutes', 'Quadriceps'],
        equipment: 'Bodyweight or Dumbbell',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 3, max: 4 },
          intermediate: { min: 4, max: 5 },
          advanced: { min: 4, max: 5 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your knees in line with your toes',
          'Keep your chest up',
          'Go down until thighs are parallel',
          'Push through your heels'
        ],
        instructions: [
          'Stand with feet wider than shoulder-width, toes pointed out',
          'Hold weight between legs if using',
          'Lower body by bending knees and hips',
          'Push back up to starting position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/8/1/2/812.jpg',
        gifUrl: 'https://gymvisual.com/img/p/8/1/2/812.gif',
        videoUrl: 'https://gymvisual.com/img/p/8/1/2/812.mp4'
      },
      {
        id: 'side-lying-hip-adduction',
        name: 'Side-Lying Hip Adduction',
        description: 'Bodyweight exercise targeting the inner thigh muscles.',
        muscleGroups: ['Adductors'],
        equipment: 'Bodyweight, Mat',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Keep your body in a straight line',
          'Control the movement',
          'Don\'t use momentum',
          'Focus on the inner thigh'
        ],
        instructions: [
          'Lie on your side with bottom leg bent',
          'Lift top leg and place foot on floor in front',
          'Lift bottom leg up toward ceiling',
          'Lower leg back down with control',
          'Repeat for desired number of reps',
          'Switch sides'
        ],
        imageUrl: 'https://gymvisual.com/img/p/8/1/3/813.jpg',
        gifUrl: 'https://gymvisual.com/img/p/8/1/3/813.gif',
        videoUrl: 'https://gymvisual.com/img/p/8/1/3/813.mp4'
      }
    ]
  },
  {
    id: 'neck',
    name: 'Neck',
    exercises: [
      {
        id: 'neck-flexion',
        name: 'Neck Flexion',
        description: 'Strengthens the front neck muscles.',
        muscleGroups: ['Neck'],
        equipment: 'Bodyweight or Neck Harness',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Move slowly and with control',
          'Don\'t use excessive resistance',
          'Stop if you feel any pain',
          'Keep movements small'
        ],
        instructions: [
          'Sit or stand with head in neutral position',
          'Slowly lower chin toward chest',
          'Return head to neutral position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/9/1/1/911.jpg',
        gifUrl: 'https://gymvisual.com/img/p/9/1/1/911.gif',
        videoUrl: 'https://gymvisual.com/img/p/9/1/1/911.mp4'
      },
      {
        id: 'neck-extension',
        name: 'Neck Extension',
        description: 'Strengthens the back neck muscles.',
        muscleGroups: ['Neck'],
        equipment: 'Bodyweight or Neck Harness',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Move very slowly',
          'Use minimal resistance',
          'Stop immediately if you feel pain',
          'Keep range of motion small'
        ],
        instructions: [
          'Sit or stand with head in neutral position',
          'Slowly tilt head back',
          'Return head to neutral position',
          'Repeat for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/9/1/2/912.jpg',
        gifUrl: 'https://gymvisual.com/img/p/9/1/2/912.gif',
        videoUrl: 'https://gymvisual.com/img/p/9/1/2/912.mp4'
      },
      {
        id: 'neck-lateral-flexion',
        name: 'Neck Lateral Flexion',
        description: 'Strengthens the side neck muscles.',
        muscleGroups: ['Neck'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 10, max: 12 },
          intermediate: { min: 12, max: 15 },
          advanced: { min: 15, max: 20 }
        },
        safetyTips: [
          'Move very slowly and gently',
          'Use only bodyweight resistance',
          'Stop immediately if you feel any pain',
          'Keep movements small and controlled'
        ],
        instructions: [
          'Sit or stand with head in neutral position',
          'Slowly tilt head to one side',
          'Return head to neutral position',
          'Repeat on other side',
          'Alternate for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/9/1/3/913.jpg',
        gifUrl: 'https://gymvisual.com/img/p/9/1/3/913.gif',
        videoUrl: 'https://gymvisual.com/img/p/9/1/3/913.mp4'
      },
      {
        id: 'neck-rotation',
        name: 'Neck Rotation',
        description: 'Improves neck mobility and strengthens rotational muscles.',
        muscleGroups: ['Neck'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        sets: {
          beginner: { min: 2, max: 3 },
          intermediate: { min: 3, max: 4 },
          advanced: { min: 3, max: 4 }
        },
        reps: {
          beginner: { min: 8, max: 10 },
          intermediate: { min: 10, max: 12 },
          advanced: { min: 12, max: 15 }
        },
        safetyTips: [
          'Move extremely slowly',
          'Stop if you feel any discomfort',
          'Don\'t force the movement',
          'Keep range of motion comfortable'
        ],
        instructions: [
          'Sit or stand with head in neutral position',
          'Slowly rotate head to one side',
          'Hold for a moment',
          'Return to center',
          'Repeat on other side',
          'Alternate for desired number of reps'
        ],
        imageUrl: 'https://gymvisual.com/img/p/9/1/4/914.jpg',
        gifUrl: 'https://gymvisual.com/img/p/9/1/4/914.gif',
        videoUrl: 'https://gymvisual.com/img/p/9/1/4/914.mp4'
      }
    ]
  }
];

// Helper function to get all exercises
export const getAllExercises = (): Exercise[] => {
  return exercisesByMuscleGroup.flatMap(group => group.exercises);
};

// Helper function to get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return getAllExercises().find(ex => ex.id === id);
};

// Helper function to get exercises by muscle group
export const getExercisesByMuscleGroup = (muscleGroupId: string): Exercise[] => {
  const group = exercisesByMuscleGroup.find(g => g.id === muscleGroupId);
  return group ? group.exercises : [];
};

