<!DOCTYPE html>
<html lang="ar">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Amiri', sans-serif;
            direction: rtl;
        }
    </style>
</head>

<body>
    <h1>{{ __('Attendance Report') }}</h1>
    <table border="1">
        <thead>
            <tr>
                <th>اسم الطالب</th>
                <th>الفصل</th>
                <th>التاريخ</th>
                <th>الحالة</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($attendances as $attendance)
            <tr>
                <td>{{ $attendance->student->name }}</td>
                <td>{{ $attendance->class->name }}</td>
                <td>{{ $attendance->date }}</td>
                <td>{{ $attendance->status }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>