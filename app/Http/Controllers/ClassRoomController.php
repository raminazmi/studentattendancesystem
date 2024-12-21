<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassRoom;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClassRoomController extends Controller
{

    public function index()
    {
        $classes = ClassRoom::with('teacher')
            ->select('id', 'name', 'section', 'teacher_id', 'created_at')
            ->latest()
            ->paginate(10);

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
        ]);
    }

    public function create()
    {
        $teachers = Teacher::select('id', 'name')->get();
        return Inertia::render('Classes/Create', [
            'teachers' => $teachers
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'section' => ['required', 'string', 'max:255'],
                'teacher_id' => ['required', 'exists:teachers,id'],
            ], [
                'name.required' => 'حقل الاسم مطلوب',
                'name.max' => 'يجب ألا يتجاوز الاسم 255 حرفًا',
                'section.required' => 'حقل القسم مطلوب',
                'section.max' => 'يجب ألا يتجاوز القسم 255 حرفًا',
                'teacher_id.required' => 'حقل المدرس مطلوب',
                'teacher_id.exists' => 'المدرس المحدد غير موجود'
            ]);

            ClassRoom::create($validated);

            return Inertia::location(route('classes.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function edit($id)
    {
        $classRoom = ClassRoom::select('id', 'name', 'section', 'teacher_id')
            ->findOrFail($id);
        $teachers = Teacher::select('id', 'name')->get();

        return Inertia::render('Classes/Edit', [
            'classRoom' => $classRoom,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'section' => ['required', 'string', 'max:255'],
                'teacher_id' => ['required', 'exists:teachers,id'],
            ], [
                'name.required' => 'حقل الاسم مطلوب',
                'name.max' => 'يجب ألا يتجاوز الاسم 255 حرفًا',
                'section.required' => 'حقل القسم مطلوب',
                'section.max' => 'يجب ألا يتجاوز القسم 255 حرفًا',
                'teacher_id.required' => 'حقل المدرس مطلوب',
                'teacher_id.exists' => 'المدرس المحدد غير موجود'
            ]);

            $classRoom = ClassRoom::findOrFail($id);
            $classRoom->update($validated);

            session()->flash('success', 'تم تحديث الصف بنجاح');

            return Inertia::location(route('classes.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }


    public function destroy($id)
    {
        $ClassRoom = ClassRoom::findOrFail($id);
        $ClassRoom->delete();

        return Inertia::location(route('classes.index'));
    }


    public function attendance($id)
    {
        $classroom = ClassRoom::with('students')->findOrFail($id);

        return Inertia::render('Classes/Attendance', [
            'classroom' => $classroom,
            'students' => $classroom->students,
        ]);
    }

    public function saveAttendance(Request $request, $id)
    {
        \Log::info('Attendance data:', $request->input('attendance'));

        $classroom = ClassRoom::findOrFail($id);
        $attendanceData = $request->input('attendance');
        $date = now()->toDateString();

        try {
            DB::transaction(function () use ($attendanceData, $classroom, $date) {
                foreach ($attendanceData as $studentId => $data) {
                    $student = Student::where('id', $studentId)
                        ->where('class_id', $classroom->id)
                        ->firstOrFail();

                    $status = is_array($data) ? $data['status'] : $data;
                    $lateTime = is_array($data) && isset($data['lateTime']) ? $data['lateTime'] : null;

                    Attendance::updateOrCreate(
                        [
                            'class_id' => $classroom->id,
                            'student_id' => $studentId,
                            'date' => $date
                        ],
                        [
                            'status' => $status,
                            'notes' => $lateTime
                        ]
                    );
                }
            });

            return response()->json(['message' => 'Attendance saved successfully!']);
        } catch (\Exception $e) {
            \Log::error('Error saving attendance: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to save attendance'], 500);
        }
    }

    public function getAttendanceStats()
    {
        $presentCount = Attendance::where('status', 'present')->count();
        $absentCount = Attendance::where('status', 'absent')->count();
        $lateCount = Attendance::where('status', 'late')->count();

        $totalCount = $presentCount + $absentCount + $lateCount;

        $data = [
            'stats' => [
                'presentRate' => $totalCount > 0 ? round(($presentCount / $totalCount) * 100, 2) : 0,
                'absentRate' => $totalCount > 0 ? round(($absentCount / $totalCount) * 100, 2) : 0,
                'lateRate' => $totalCount > 0 ? round(($lateCount / $totalCount) * 100, 2) : 0,
            ],
            'chart' => []
        ];

        return response()->json($data);
    }
    public function getAttendanceStatistics()
    {
        $studentsCount = Student::count();
        $teachersCount = Teacher::count();
        $classesCount = ClassRoom::count();
        $totalStudentAttendance = Attendance::count();

        $data = [
            'students_count' => $studentsCount,
            'teachers_count' => $teachersCount,
            'classes_count' => $classesCount,
            'total_student_attendance' => $totalStudentAttendance,
        ];

        return response()->json($data);
    }

    public function report(Request $request)
    {
        $attendances = Attendance::with(['student', 'class'])
            ->when($request->date_from, function ($query) use ($request) {
                return $query->whereDate('date', '>=', $request->date_from);
            })
            ->when($request->date_to, function ($query) use ($request) {
                return $query->whereDate('date', '<=', $request->date_to);
            })
            ->get();

        return Inertia::render('Attendance/Report', [
            'attendances' => $attendances
        ]);
    }
}
