% Clear the workspace and the screen
sca;
close all;
clearvars;
try
    % Here we call some default settings for setting up Psychtoolbox
    PsychDefaultSetup(2);
    
    geteye=0; %set to 1 to send info to eyelink
    if geteye
        disp("working");
%         filename=input('Input unique name for saving data in matlab:', 's');
        edf_filename=input('Input unique name for saving Eyelink data, only 8 or less letters and num allowed:', 's');
        edf_filename=strcat(edf_filename,'.edf');
    end
    
    ListenChar(2);
    % Get the screen numbers. This gives us a number for each of the screens
    % attached to our computer.
    screens = Screen('Screens');
    disp(screens);
    % To draw we select the maximum of these numbers. So in a situation where we
    % have two screens attached to our monitor we will draw to the external
    % screen.                             
    screenNumber = max(screens); 

    % Define colors. Define black and white (white will be 1 and black 0). This is because
    % in general luminace values are defined between 0 and 1 with 255 steps in
    % between. All values in Psychtoolbox are defined between 0 and 1
    white = WhiteIndex(screenNumber);
    black = BlackIndex(screenNumber);
    grey = white / 2;

    % Open an on screen window using PsychImaging and color it grey.
    [window, windowRect] = PsychImaging('OpenWindow',screenNumber, grey);
    wp=window;
    
    % Get the size of the on screen window in pixels.
    % For help see: Screen WindowSize?


    [screenXpixels, screenYpixels] = Screen('WindowSize', window);

    % Get the centre coordinate of the window in pixels
    % For help see: help RectCenter
    [xCenter, yCenter] = RectCenter(windowRect);

    % Setting up triangle dimensions
    TriBaseLengthPerArray=[1, 0.75, 0.5, 0.25, 0.1];
    TriBaseAngleArray = [pi/6, pi/5, pi/4];
    StrkWdth = 2;

    LengthBaseOrig = screenXpixels*.9;
    LengthAngleSideOrig = LengthBaseOrig*.2;

    TriBaseXStartOrig = screenXpixels*.05;
    TriBaseXEndOrig = LengthBaseOrig+TriBaseXStartOrig;
    height = tan(pi/4)*.5*LengthBaseOrig;
    TriBaseYPos = (screenYpixels-height)*.5+height;

    % New code here
    num_trials = 5;
    timer = 5;  

    
    
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %                        EYE LINK SETUP                         
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   
    if geteye
%         disp("working");
        % Provide Eyelink with details about the graphics environment
        % and perform some initializations. The information is returned
        % in a structure that also contains useful defaults
        % and control codes (e.g. tracker state bit and Eyelink key values).
        el=EyelinkInitDefaults(wp);%%returns values


         % setup the proper calibration foreground and background colors
        el.backgroundcolour = grey;
        el.foregroundcolour = black;
        el.calibrationtargetcolour= WhiteIndex(el.window);

        EyelinkUpdateDefaults(el);


    % 
    %     % STEP 4
    %     % Initialization of the connection with the Eyelink Gazetracker.
    %     % exit program if this fails.
        if ~EyelinkInit(0)
            fprintf('Eyelink Init aborted.\n');
            % Shutdown Eyelink:
            Eyelink('Shutdown');
            %break;

            return;
        end

        connected=Eyelink('IsConnected');%%Just to verify connection

        [v vs]=Eyelink('GetTrackerVersion');

        fprintf('Running experiment on a ''%s'' tracker.\n', vs );

        % open file to record data to
        tempeye = Eyelink('Openfile', edf_filename);%%doesn't return
        if tempeye~=0
            printf('Cannot create EDF file ''%s'' ', edf_filename);
            Eyelink( 'Shutdown');
            return;
        end


        % CHANGE HOST PC PARAMETERS HERE   
        % SET UP TRACKER CONFIGURATION
        % Setting the proper recording resolution, proper calibration type, 
        % as well as the data file content;
        Eyelink('command','screen_pixel_coords = %ld %ld %ld %ld', 0, 0, (windowRect(3)-1), (windowRect(4)-1)); % scr_r(3) = width; scr_r(4) = height
        Eyelink('message', 'DISPLAY_COORDS %ld %ld %ld %ld', 0, 0, (windowRect(3)-1), (windowRect(4)-1));                

        
        
        
        Eyelink('command', 'saccade_acceleration_threshold = 8000');

        Eyelink('command', 'saccade_velocity_threshold = 30');

        Eyelink('command', 'saccade_motion_threshold = 0.0');

        Eyelink('command', 'saccade_pursuit_fixup = 60');

        Eyelink('command', 'fixation_update_interval = 0');%what does?

        % set EDF file contents
        Eyelink('command', 'file_event_filter = LEFT,RIGHT,FIXATION,SACCADE,BLINK,MESSAGE,BUTTON');
        Eyelink('command', 'file_sample_data  = LEFT,RIGHT,GAZE,HREF,AREA,GAZERES,STATUS');

    % set link data (used for gaze cursor)
        Eyelink('command', 'link_event_filter = LEFT,RIGHT,FIXATION,SACCADE,BLINK,MESSAGE,BUTTON');
        Eyelink('command', 'link_sample_data  = LEFT,RIGHT,GAZE,GAZERES,AREA,STATUS');

        % make sure we're still connected.
        if Eyelink('IsConnected')~=1
            Eyelink( 'Shutdown');
            return;
        end




        % Hide the mouse cursor;
        Screen('HideCursorHelper', wp);

        % Calibrate the eye tracker
        EyelinkDoTrackerSetup(el);
        eye_used = Eyelink('EyeAvailable');
    %     
    %    % do a final check of calibration using driftcorrection
    % %     EyelinkDoDriftCorrection(el);
    %     
    %     
    %   
    end
    % not too sure what this does
    topPriorityLevel = MaxPriority(window);
    Priority(topPriorityLevel);
    for trial = 1:num_trials
        DrawFormattedText(window, ['Trial: ' num2str(trial) '. Drag the dot do the upper vertex of the triangle \n\n Press any key to begin'],... 
            'center', 'center', black);
        Screen('Flip', window);      
        KbStrokeWait;
        if geteye
            %%%%eyetracker
            %%%%stuff==============================================
            %%%%===================================================
            % Send trial id message to Eyelink file

            % Sending a 'TRIALID' message to mark the start of a trial in Data 
            % Viewer.  This is different than the start of recording message 
            % START that is logged when the trial recording begins. The viewer
            % will not parse any messages, events, or samples, that exist in 
            % the data file prior to this message. 
            Eyelink('Message', 'TRIALID %d', trial);

            % This supplies the title at the bottom of the eyetracker display
            Eyelink('command', 'record_status_message "TRIAL %d"', trial); 
            

            %%%actually start recording
            Eyelink('StartRecording');
             % mark zero-plot time in data file
            %%%%%%%%%%%%%%%%%%%%
            Eyelink('Message', 'SYNCTIME');
                  
        end
        cur_angle_index = randi([1, length(TriBaseAngleArray)]);
        cur_base_index = randi([1, length(TriBaseLengthPerArray)]);

        AngleOrig = TriBaseAngleArray(cur_angle_index);
        BaseLengthFactor = TriBaseLengthPerArray(cur_base_index);
        BaseLength = LengthBaseOrig*BaseLengthFactor;


        % Draw dot to be dragged
        dotColor = [0 1 0];
        dotXpos = 100;
        dotYpos = 100;
        dotSet = 0;
        
        % Make the dot size depend on the size of the triangle
        if BaseLength < screenXpixels/2
            dotSizeFactor = .0000065;
        else
            dotSizeFactor = .0000085;
        end

        dotSizePix = screenYpixels*screenXpixels*dotSizeFactor;        
%         Screen('DrawDots', window, [dotXpos dotYpos], dotSizePix, dotColor, [], 2);

        ifi = Screen('GetFlipInterval', window);         

        % Set mouse position
        SetMouse(xCenter, yCenter, window);

        TriBaseXStart = TriBaseXStartOrig+.5*(1-BaseLengthFactor)*LengthBaseOrig;
        TriBaseXEnd = TriBaseXStart+BaseLength;
        TriSideXLengthIn = LengthAngleSideOrig*BaseLengthFactor;
        TriSideYLengthUp = tan(AngleOrig)*TriSideXLengthIn;
        Screen('DrawLines', window, [TriBaseXStart, TriBaseXStart+TriSideXLengthIn*1.3; TriBaseYPos, TriBaseYPos], StrkWdth);
        Screen('Drawlines', window, [TriBaseXEnd, TriBaseXEnd-TriSideXLengthIn*1.3; TriBaseYPos, TriBaseYPos], StrkWdth);
        Screen('Drawlines', window, [TriBaseXEnd, TriBaseXEnd-TriSideXLengthIn; TriBaseYPos, TriBaseYPos-TriSideYLengthUp], StrkWdth);
        Screen('Drawlines', window, [TriBaseXStart, TriBaseXStart+TriSideXLengthIn; TriBaseYPos, TriBaseYPos-TriSideYLengthUp], StrkWdth);
        DrawFormattedText(window, ['After moving, hit any key to continue'], 'left', black);
        vbl = Screen('Flip', window);
        offset = 0;
        inside = 0;
        counter = 0;
        waitframes = 1; 
        
        tic
        while ~KbCheck

            % Get the current position of the mouse
            [mx, my, buttons] = GetMouse(window);             

            

            % See if the mouse cursor is inside the dot
            if counter == 0
                counter = 40;                 
                if ((mx-dotXpos)^2+(my-dotYpos)^2 <= (dotSizePix/2)^2)
                    inside = 1;
                else
                    inside = 0;
                end
            end 

            if inside==1 && sum(buttons) > 0 && offset == 0
                dx = mx-dotXpos;
                dy = my-dotYpos;
                offset = 1;
            end 

            % If we are clicking on the square allow its position to be modified by
            % moving the mouse, correcting for the offset between the centre of the
            % square and the mouse position
            if inside == 1 && sum(buttons) > 0
                dotXpos = mx - dx;
                dotYpos = my - dy;
            end
            
            if dotSet
                Screen('DrawDots', window, [dotXpos dotYpos], dotSizePix, dotColor, [], 2);
            else
                if sum(buttons) > 0
                    Screen('DrawDots', window, [mx my], dotSizePix, dotColor, [], 2);
                    dotXpos = mx;
                    dotYpos = my;
                    dotSet = 1;
                end
            end
            

            % redraw triangle
%             if toc<timer
                Screen('DrawLines', window, [TriBaseXStart, TriBaseXStart+TriSideXLengthIn*1.3; TriBaseYPos, TriBaseYPos], StrkWdth); 
                Screen('Drawlines', window, [TriBaseXEnd, TriBaseXEnd-TriSideXLengthIn*1.3; TriBaseYPos, TriBaseYPos], StrkWdth);
                Screen('Drawlines', window, [TriBaseXEnd, TriBaseXEnd-TriSideXLengthIn; TriBaseYPos, TriBaseYPos-TriSideYLengthUp], StrkWdth);
                Screen('Drawlines', window, [TriBaseXStart, TriBaseXStart+TriSideXLengthIn; TriBaseYPos, TriBaseYPos-TriSideYLengthUp], StrkWdth);
%             end  

            % Flip to the screen          
            vbl  = Screen('Flip', window); 

            if sum(buttons) <= 0
                offsetSet = 0;
            end
            counter = counter-1;
        end
        
        if geteye
            %%%%eyetracker
            %%%%stuff==============================================
            %%%%===================================================

            % adds 100 msec of data to catch final events
            WaitSecs(0.1);
            % stop the recording of eye-movements for the current trial
            Eyelink('StopRecording');
            
            Eyelink('Message', ['Dot positions: ' num2str(dotXpos) ', ' num2str(dotYpos)]);
            Eyelink('Message', ['Triangle Angle: ' nums2str(AngleOrig)]);
            Eyelink('Message', 'Triangle Base: %d', BaseLength);
            % Sending a 'TRIAL_RESULT' message to mark the end of a trial in 
            % Data Viewer. This is different than the end of recording message 
            % END that is logged when the trial recording ends. The viewer will
            % not parse any messages, events, or samples that exist in the data 
            % file after this message.
            Eyelink('Message', 'TRIAL_RESULT 0')
        end
    end

    % Now we have drawn to the screen we wait for a keyboard button press d(any
    % key) to terminate the demo.
    % KbStrokeWait;

    % Clear the screen.
    if geteye
        %%%%%eyetracker
        %%%%stuff==============================================
        %%%%===================================================

        %     % STEP 7
        %     % finish up: stop recording eye-movements,
        %     % close graphics wp, close data file and shut down tracker
        Eyelink('command', 'generate_default_targets = YES');
        Eyelink('Command', 'set_idle_mode');
        WaitSecs(0.5);
        Eyelink('CloseFile');
        % download data file
        try
            fprintf('Receiving data file ''%s''\n', edf_filename );
            status=Eyelink('ReceiveFile');
            if status > 0
                fprintf('ReceiveFile status %d\n', status);
            end
            if 2==exist(edf_filename, 'file')
                fprintf('Data file ''%s'' can be found in ''%s''\n', edf_filename, pwd );
            end
        catch
            fprintf('Problem receiving data file ''%s''\n', edf_filename );
        end

        %%%%%%%%%%%%%%%%shut it down
        Eyelink('ShutDown');
    end
    sca;
    ListenChar(0);
catch
     %this "catch" section executes in case of an error in the "try" section
    %above.  Importantly, it closes the onscreen wp if its open.
    save('./crash.mat');
    
    if geteye
        if Eyelink('IsConnected')==1
            Eyelink( 'Shutdown');
        end
    end
    Screen('CloseAll');
    ShowCursor;
    ListenChar(0);
    Priority(0);
    rethrow(lasterror);
%     commandwindow;
%     psychrethrow(psychlasterror);
end
