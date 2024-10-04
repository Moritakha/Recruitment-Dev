<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StringValueController extends Controller
{
    public function calculateMaxValue(Request $request)
    {
        $t = $request->input('t');
        $n = strlen($t);
        $maxValue = 0;

        // Crear un array para contar la frecuencia de cada substring
        $frequency = [];

        // Contar la frecuencia de cada substring
        for ($length = 1; $length <= $n; $length++) {
            for ($start = 0; $start <= $n - $length; $start++) {
                $substring = substr($t, $start, $length);
                if (isset($frequency[$substring])) {
                    $frequency[$substring]++;
                } else {
                    $frequency[$substring] = 1;
                }
            }
        }

        // Calcular el valor máximo
        foreach ($frequency as $substring => $freq) {
            $value = strlen($substring) * $freq;
            $maxValue = max($maxValue, $value);
        }

        return response()->json(['maxValue' => $maxValue]);
    }
}