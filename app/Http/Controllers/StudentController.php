<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassRoom;
use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::select('id', 'name', 'email', 'phone', 'class_id', 'parent_whatsapp', 'cycle', 'grades', 'path', 'created_at')
            ->latest()
            ->paginate(10);

        $classes = ClassRoom::select('id', 'name')->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'classes' => $classes
        ]);
    }

    public function create()
    {
        $classes = ClassRoom::select('id', 'name')->get();
        return Inertia::render('Students/Create', [
            'classes' => $classes,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:students,email,'],
                'phone' => ['nullable', 'string', 'max:15'],
                'class_id' => ['required', 'exists:classes,id'],
                'parent_whatsapp' => ['nullable', 'string', 'max:20'],
                'cycle' => ['required', 'string'],
                'grades' => ['required', 'integer'],
                'path' => ['nullable', 'in:general,advanced'],
            ], [
                'name.required' => 'حقل الاسم مطلوب',
                'name.max' => 'يجب ألا يتجاوز الاسم 255 حرفًا',
                'email.required' => 'حقل البريد الإلكتروني مطلوب',
                'email.email' => 'يجب أن يكون البريد الإلكتروني صالحًا',
                'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
                'phone.max' => 'يجب ألا يتجاوز رقم الهاتف 15 رقمًا',
                'class_id.required' => 'حقل الصف مطلوب',
                'class_id.exists' => 'الصف المحدد غير موجود',
                'cycle.required' => 'حقل الدورة مطلوب',
                'grades.required' => 'حقل الدرجات مطلوب',
                'path.in' => 'المسار يجب أن يكون إما "عام" أو "متقدم"',
            ]);

            Student::create($validated);

            return Inertia::location(route('students.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function edit($id)
    {
        $student = Student::select('id', 'name', 'email', 'phone', 'class_id', 'parent_whatsapp', 'cycle', 'grades', 'path')
            ->findOrFail($id);

        $classes = ClassRoom::select('id', 'name')->get();
        return Inertia::render('Students/Edit', [
            'student' => $student,
            'classes' => $classes
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:students,email,' . $id],
                'phone' => ['nullable', 'string', 'max:15'],
                'class_id' => ['required', 'exists:classes,id'],
                'parent_whatsapp' => ['nullable', 'string', 'max:20'],
                'cycle' => ['required', 'string'],
                'grades' => ['required', 'integer'],
                'path' => ['nullable', 'in:general,advanced'],
            ], [
                'name.required' => 'حقل الاسم مطلوب',
                'name.max' => 'يجب ألا يتجاوز الاسم 255 حرفًا',
                'email.required' => 'حقل البريد الإلكتروني مطلوب',
                'email.email' => 'يجب أن يكون البريد الإلكتروني صالحًا',
                'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
                'phone.max' => 'يجب ألا يتجاوز رقم الهاتف 15 رقمًا',
                'class_id.required' => 'حقل الصف مطلوب',
                'class_id.exists' => 'الصف المحدد غير موجود',
                'cycle.required' => 'حقل الدورة مطلوب',
                'grades.required' => 'حقل الدرجات مطلوب',
                'path.in' => 'المسار يجب أن يكون إما "عام" أو "متقدم"',
            ]);

            $student = Student::findOrFail($id);
            $student->update($validated);
            session()->flash('success', 'تم تحديث الطالب بنجاح');
            return Inertia::location(route('students.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return Inertia::location(route('students.index'));
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
