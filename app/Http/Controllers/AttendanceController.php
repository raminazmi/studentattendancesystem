<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassRoom;
use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;


class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::select('id', 'student_id', 'class_id', 'date', 'status', 'notes', 'created_at')
            ->with(['student', 'class'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances
        ]);
    }

    public function create()
    {
        $students = Student::select('id', 'name')->get();
        $classes = ClassRoom::select('id', 'name', 'section')->get();

        return Inertia::render('Attendance/Create', [
            'students' => $students,
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => ['required', 'exists:students,id'],
                'class_id' => ['required', 'exists:class_rooms,id'],
                'date' => ['required', 'date'],
                'status' => ['required', 'in:present,absent,late'],
                'notes' => ['nullable', 'string', 'max:255']
            ], [
                'student_id.required' => 'حقل الطالب مطلوب',
                'student_id.exists' => 'الطالب المحدد غير موجود',
                'class_id.required' => 'حقل الصف مطلوب',
                'class_id.exists' => 'الصف المحدد غير موجود',
                'date.required' => 'حقل التاريخ مطلوب',
                'date.date' => 'يجب أن يكون التاريخ صالحًا',
                'status.required' => 'حقل الحالة مطلوب',
                'status.in' => 'حالة الحضور غير صالحة',
                'notes.max' => 'يجب ألا تتجاوز الملاحظات 255 حرفًا'
            ]);

            Attendance::create($validated);

            return Inertia::location(route('attendance.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function edit($id)
    {
        $attendance = Attendance::select('id', 'student_id', 'class_id', 'date', 'status', 'notes')
            ->findOrFail($id);

        $students = Student::select('id', 'name')->get();
        $classes = ClassRoom::select('id', 'name', 'section')->get();

        return Inertia::render('Attendance/Edit', [
            'attendance' => $attendance,
            'students' => $students,
            'classes' => $classes
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'student_id' => ['required', 'exists:students,id'],
                'class_id' => ['required', 'exists:class_rooms,id'],
                'date' => ['required', 'date'],
                'status' => ['required', 'in:present,absent,late'],
                'notes' => ['nullable', 'string', 'max:255']
            ], [
                'student_id.required' => 'حقل الطالب مطلوب',
                'student_id.exists' => 'الطالب المحدد غير موجود',
                'class_id.required' => 'حقل الصف مطلوب',
                'class_id.exists' => 'الصف المحدد غير موجود',
                'date.required' => 'حقل التاريخ مطلوب',
                'date.date' => 'يجب أن يكون التاريخ صالحًا',
                'status.required' => 'حقل الحالة مطلوب',
                'status.in' => 'حالة الحضور غير صالحة',
                'notes.max' => 'يجب ألا تتجاوز الملاحظات 255 حرفًا'
            ]);

            $attendance = Attendance::findOrFail($id);
            $attendance->update($validated);

            session()->flash('success', 'تم تحديث سجل الحضور بنجاح');

            return Inertia::location(route('attendance.index'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return Inertia::location(route('attendance.index'));
    }

    public function getAttendanceStats(Request $request)
    {
        $period = $request->input('period', 'daily');
        $attendanceQuery = Attendance::query();

        if ($period == 'daily') {
            $attendanceData = $attendanceQuery->selectRaw('date, status, count(*) as count')
                ->groupBy('date', 'status')
                ->orderBy('date')
                ->get();
        } elseif ($period == 'weekly') {
            $attendanceData = $attendanceQuery->selectRaw('WEEK(date) as week, status, count(*) as count')
                ->groupByRaw('WEEK(date), status')
                ->orderBy('week')
                ->get();
        } elseif ($period == 'monthly') {
            $attendanceData = $attendanceQuery->selectRaw('MONTH(date) as month, status, count(*) as count')
                ->groupByRaw('MONTH(date), status')
                ->orderBy('month')
                ->get();
        }

        $labels = [];
        $presentData = [];
        $absentData = [];
        $lateData = [];

        foreach ($attendanceData as $attendance) {
            if ($period == 'daily') {
                $labels[] = $attendance->date;
            } elseif ($period == 'weekly') {
                $labels[] = 'Week ' . $attendance->week;
            } elseif ($period == 'monthly') {
                $labels[] = 'Month ' . $attendance->month;
            }

            if ($attendance->status == 'present') {
                $presentData[] = $attendance->count;
                $absentData[] = 0;
                $lateData[] = 0;
            } elseif ($attendance->status == 'absent') {
                $absentData[] = $attendance->count;
                $presentData[] = 0;
                $lateData[] = 0;
            } elseif ($attendance->status == 'late') {
                $lateData[] = $attendance->count;
                $presentData[] = 0;
                $absentData[] = 0;
            }
        }

        $totalCount = array_sum($presentData) + array_sum($absentData) + array_sum($lateData);
        $data = [
            'stats' => [
                'presentRate' => $totalCount > 0 ? round((array_sum($presentData) / $totalCount) * 100, 2) : 0,
                'absentRate' => $totalCount > 0 ? round((array_sum($absentData) / $totalCount) * 100, 2) : 0,
                'lateRate' => $totalCount > 0 ? round((array_sum($lateData) / $totalCount) * 100, 2) : 0,
            ],
            'chart' => [
                'labels' => $labels,
                'present' => $presentData,
                'absent' => $absentData,
                'late' => $lateData,
            ]
        ];
        return response()->json($data);
    }

    public function export(Request $request)
    {
        $format = $request->input('format');
        $attendances = Attendance::with(['student', 'class'])->get();

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('reports.attendance', compact('attendances'));
            return $pdf->download('attendance_report.pdf');
        } elseif ($format === 'csv') {
            $csvData = $this->generateCSV($attendances);
            $filename = 'attendance_report.csv';

            return Response::stream(function () use ($csvData) {
                echo $csvData;
            }, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename={$filename}",
            ]);
        }
    }

    private function generateCSV($attendances)
    {
        $csv = "Student,Class,Date,Status\n";
        foreach ($attendances as $attendance) {
            $csv .= "{$attendance->student->name},{$attendance->class->name},{$attendance->date},{$attendance->status}\n";
        }
        return $csv;
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
