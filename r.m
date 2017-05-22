% quit_key = 20;
% keyIsDown = 0;
% while ~keyIsDown
%      [keyIsDown, secs, keycode] = KbCheck(-1); %check response
%      if keycode(quit_key)
%          quit=1;
%      end
% end
% disp(keycodep)

[secs, keyCode, deltaSpecs] = KbStrokeWait;
disp(keyCode);p