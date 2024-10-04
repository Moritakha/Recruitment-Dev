<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChessController extends Controller
{
    public function queensAttack(Request $request)
    {
        $validated = $request->validate([
            'n' => 'required|integer|min:1|max:100000',
            'k' => 'required|integer|min:0|max:100000',
            'rq' => 'required|integer|min:1',
            'cq' => 'required|integer|min:1',
            'obstacles' => 'array',
            'obstacles.*' => 'array|min:2|max:2',
        ]);

        $n = $validated['n'];
        $k = $validated['k'];
        $rq = $validated['rq'];
        $cq = $validated['cq'];
        $obstacles = $validated['obstacles'];

        $attackableSquares = $this->calculateAttackableSquares($n, $rq, $cq, $obstacles);

        return response()->json(['attackable_squares' => $attackableSquares]);
    }

    private function calculateAttackableSquares($n, $rq, $cq, $obstacles)
    {
        $attackableCount = 0;

        $directions = [
            [-1, 0], 
            [1, 0],  
            [0, -1], 
            [0, 1],  
            [-1, -1], 
            [-1, 1],  
            [1, -1],  
            [1, 1],   
        ];

        $obstacleSet = [];
        foreach ($obstacles as $obstacle) {
            $obstacleSet[$obstacle[0] . ',' . $obstacle[1]] = true;
        }

        foreach ($directions as $direction) {
            $x = $rq;
            $y = $cq;

            while (true) {
                $x += $direction[0];
                $y += $direction[1];

                if ($x < 1 || $x > $n || $y < 1 || $y > $n) {
                    break;
                }

                if (isset($obstacleSet[$x . ',' . $y])) {
                    break;
                }

                $attackableCount++;
            }
        }

        return $attackableCount;
    }
}